#' Adds documentation of a dataset to a datapackage
#'
#' Add information about variables in a dataset to a \code{datapackage.json} metadata file.
#'
#' @param path A character vector of paths to plain-text tabular data files.
#' @param meta Information about each data file. A list with a list entry for each entry in \code{path}; see details.
#' @param package_path Package to add the metadata to; path to the .json file, or a list with the read-in version.
#' @param dir Directory in which to look for \code{path}, and write \code{package_path}.
#' @param write Logical; if \code{FALSE}, returns the \code{paths} metadata without reading or rewriting
#' \code{package_path}.
#' @param refresh Logical; if \code{TRUE}, will remove any existing dataset information.
#' @param sha A number specifying the Secure Hash Algorithm function,
#' if \code{openssl} is available (checked with \code{Sys.which('openssl')}).
#' @param clean Logical; if \code{TRUE}, strips special characters before saving.
#' @param open_after Logical; if \code{TRUE}, opens the written datapackage after saving.
#' @details
#' \code{meta} should be a list with unnamed entries for entry in \code{path}, and each entry can include a named entry
#' for any of these:
#' \describe{
#'   \item{source}{
#'   A list or list of lists with entries for at least \code{name}, and ideally for \code{url}.
#'   }
#'   \item{ids}{
#'   A list or list of lists with entries for at least \code{variable} (the name of a variable in the dataset).
#'   Might also include \code{map} with a list or path to a JSON file resulting in a list with an
#'   entry for each ID, and additional information about that entity, to be read in a its features.
#'   All files will be loaded to help with aggregation, but local files will be included in the datapackage,
#'   whereas hosted files will be loaded client-side.
#'   }
#'   \item{time}{
#'   A string giving the name of a variable in the dataset representing a repeated observation of the same entity.
#'   }
#'   \item{variables}{
#'   A list with named entries providing more information about the variables in the dataset.
#'   }
#' }
#' @examples
#' \dontrun{
#' # write example data
#' write.csv(mtcars, "mtcars.csv")
#'
#' # add it to an existing datapackage.json file in the current working directory
#' data_add("mtcars.csv")
#' }
#' @return An invisible version of the metadata, which is also added to \code{datapackage.json} if \code{write = TRUE}.
#' @seealso Initialize the \code{datapackage.json} file with \code{\link{init_data}}.
#' @export

data_add <- function(path, meta = list(), package_path = "datapackage.json", dir = ".", write = TRUE,
                     refresh = FALSE, sha = "512", clean = FALSE, open_after = FALSE) {
  if (missing(path)) cli_abort("{.arg path} must be specified")
  if (check_template("site", dir = dir)$status[["strict"]]) dir <- paste0(dir, "/docs/data")
  opath <- path
  path <- normalizePath(paste0(dir, "/", path), "/", FALSE)
  ck <- !file.exists(path)
  if (any(ck)) path[ck] <- opath[ck]
  if (any(!file.exists(path))) cli_abort("{?a path/paths} did not exist: {path[!file.exists(path)]}")
  package <- if (is.character(package_path) && !file.exists(package_path)) {
    normalizePath(paste0(dir, "/", package_path), "/", FALSE)
  } else {
    package_path
  }
  if (write) {
    if (is.character(package)) {
      if (!file.exists(package)) {
        package <- normalizePath(paste0(dirname(path), "/", package_path), "/", FALSE)
      }
      if (file.exists(package)) {
        package_path <- package
        package <- read_json(package)
      } else {
        cli_abort(c("{.arg package} ({.path {package}}) does not exist", i = "create it with {.fn init_data}"))
      }
    }
    if (!is.list(package) || is.null(package$resource)) {
      cli_abort(c(
        "{.arg package} does not appear to be in the right format",
        i = "this should be (or be read in from json as) a list with a {.code resource} entry"
      ))
    }
  }
  collect_metadata <- function(file) {
    f <- path[[file]]
    m <- metas[[file]]
    name <- basename(f)
    format <- tolower(strsplit(f, ".", fixed = TRUE)[[1]][2])
    if (is.na(format)) format <- "rds"
    info <- file.info(f)
    metas <- list()
    data <- tryCatch(if (format == "rds") readRDS(f) else fread(f), error = function(e) NULL)
    if (is.null(data)) {
      cli_abort(c(
        paste0("failed to read in the data file ({.file {f}})"),
        i = "check that it is in a compatible format"
      ))
    }
    if (!all(rownames(data) == seq_len(nrow(data)))) data <- cbind(`_row` = rownames(data), data)
    unpack_meta <- function(n) {
      if (!length(m[[n]])) list() else if (is.list(m[[n]][[1]])) m[[n]] else list(m[[n]])
    }
    varinf <- unpack_meta("variables")
    if (length(varinf) == 1 && is.character(varinf[[1]])) {
      if (!file.exists(varinf[[1]])) varinf[[1]] <- paste0(dir, "/", varinf[[1]])
      if (file.exists(varinf[[1]])) {
        if (varinf[[1]] %in% names(metas)) {
          varinf <- metas[[varinf[[1]]]]
        } else {
          varinf <- metas[[varinf[[1]]]] <- read_json(varinf[[1]])
        }
      }
    }
    ids <- unpack_meta("ids")
    idvars <- NULL
    for (i in seq_along(ids)) {
      if (is.list(ids[[i]])) {
        if (length(ids[[i]]$map) == 1 && is.character(ids[[i]]$map) && file.exists(ids[[i]]$map)) {
          ids[[i]]$map_content <- paste(readLines(ids[[i]]$map, warn = FALSE), collapse = "")
        }
      } else {
        ids[[i]] <- list(variable = ids[[i]])
      }
      if (!ids[[i]]$variable %in% idvars) idvars <- c(idvars, ids[[i]]$variable)
    }
    timevar <- unlist(unpack_meta("time"))
    times <- if (is.null(timevar)) seq_len(nrow(data)) else data[[timevar]]
    res <- list(
      bytes = as.integer(info$size),
      encoding = stri_enc_detect(f)[[1]][1, 1],
      md5 = md5sum(f)[[1]],
      format = format,
      name = if (!is.null(names(opath))) {
        names(opath)[file]
      } else if (!is.null(m$name)) {
        m$name
      } else {
        sub("\\.[^.]*$", "", name)
      },
      filename = name,
      source = unpack_meta("source"),
      ids = ids,
      time = timevar,
      profile = "data-resource",
      created = as.character(info$mtime),
      last_modified = as.character(info$ctime),
      row_count = nrow(data),
      entity_count = if (length(idvars)) length(unique(data[[idvars[1]]])) else nrow(data),
      schema = list(
        fields = lapply(colnames(data)[!colnames(data) %in% idvars], function(cn) {
          v <- data[[cn]]
          invalid <- !is.finite(v)
          r <- list(name = cn, duplicates = sum(duplicated(v)))
          if (cn %in% names(varinf)) r$info <- varinf[[cn]]
          r$time_range <- which(unname(tapply(v, times, function(v) any(!is.na(v))))) - 1
          r$time_range <- if (length(r$time_range)) r$time_range[c(1, length(r$time_range))] else c(-1, -1)
          if (all(invalid)) {
            r$type <- "unknown"
            r$missing <- length(v)
          } else if (is.numeric(v)) {
            r$type <- if (all(invalid | v %% 1 == 0)) "integer" else "float"
            r$missing <- sum(invalid)
            r$mean <- round(mean(v, na.rm = TRUE), 6)
            r$sd <- round(sd(v, na.rm = TRUE), 6)
            r$min <- round(min(v, na.rm = TRUE), 6)
            r$max <- round(max(v, na.rm = TRUE), 6)
          } else {
            r$type <- "string"
            v <- as.factor(as.character(v))
            r$missing <- sum(is.na(v) | is.nan(v) | grepl("^[\\s.-]$", v))
            r$table <- structure(as.list(tabulate(v)), names = levels(v))
          }
          r
        })
      )
    )
    if ("_references" %in% names(varinf)) res[["_references"]] <- varinf[["_references"]]
    if (Sys.which("openssl") != "") {
      res[[paste0("sha", sha)]] <- tryCatch(
        strsplit(
          system2("openssl", c("dgst", paste0("-sha", sha), shQuote(f)), TRUE), " ",
          fixed = TRUE
        )[[1]][2],
        error = function(e) ""
      )
      res <- res[c(1:3, length(res), seq(4, length(res) - 1))]
    }
    res
  }
  metas <- vector("list", length(path))
  if (!is.null(names(meta))) {
    metas[[1]] <- meta
  } else {
    for (i in seq_along(meta)) metas[[i]] <- meta[[i]]
  }
  metadata <- lapply(seq_along(path), collect_metadata)
  if (write) {
    package$resources <- c(metadata, if (!refresh) package$resources)
    names <- vapply(package$resources, "[[", "", "filename")
    if (anyDuplicated(names)) {
      package$resources <- package$resources[!duplicated(names)]
    }
    package_path <- if (is.character(package_path)) package_path else "datapackage.json"
    if (clean) {
      cf <- lma_dict("special", perl = TRUE, as.function = gsub)
      package <- fromJSON(cf(toJSON(package, auto_unbox = TRUE)))
    }
    write_json(package, package_path, pretty = TRUE, auto_unbox = TRUE, digits = 6)
    if (interactive()) {
      cli_bullets(c(v = "added resource to {.file datapackage.json}:", "*" = paste0("{.path ", package_path, "}")))
      if (open_after) navigateToFile(package_path)
    }
  }
  invisible(metadata)
}
