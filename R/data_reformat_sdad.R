#' Reformat an SDAD-formatted dataset
#'
#' Unify multiple files, which each contain a tall set of variables associated with regions.
#'
#' The basic assumption is that there are (a) entities which (b) exist in a hierarchy, and
#' (c1) have a static set of features and (c2) a set of variable features which
#' (d) are assessed at multiple time points.
#'
#' For example (and generally), entities are (a) regions, with (b) smaller regions making up larger regions,
#' and which (c1) have names, and (c2) population and demographic counts (d) between 2009 and 2019.
#'
#' @param files A character vector of file paths, or the path to a directory containing data files.
#' @param value Name of the column containing variable values.
#' @param value_name Name of the column containing variable names; assumed to be a single variable per file if
#' not present.
#' @param id Column name IDs which uniquely identify entities.
#' @param time Column name of the variable representing time.
#' @param dataset Column name used to separate entity scales.
#' @param value_info A vector of column names which provide additional information about values
#' (such as their name and type).
#' @param entity_info A vector of column names which provide additional information about entities
#' (such as their name and type).
#' @param out Path to a directory to write files to; if not specified, files will not be written.
#' @examples
#' \dontrun{
#' data_reformat_sdad("data/directory")
#' }
#' @return An invisible list of the unified variable datasets, split into datasets.
#' @export

data_reformat_sdad <- function(files, value = "value", value_name = "measure", id = "geoid", time = "year",
                               dataset = "region_type", value_info = "measure_type",
                               entity_info = c("region_type", "region_name"), out = NULL) {
  if (length(files) == 1 && dir.exists(files)) {
    files <- list.files(files, full.names = TRUE)
  }
  if (any(!file.exists(files))) cli_abort("file{? does/s do} not exist: {.file {files[!file.exists(files)]}}")
  vars <- c(value, value_name, id, time, dataset, value_info, entity_info)
  spec <- c(
    missing(value), missing(value_name), missing(id), missing(time), missing(dataset),
    rep(missing(value_info), length(value_info)),
    rep(missing(entity_info), length(entity_info))
  )
  data <- list()
  names <- list()
  for (f in files) {
    d <- tryCatch(fread(f), error = function(e) NULL)
    if (is.null(d)) cli_abort("failed to read in file {.file {f}}")
    if (any(su <- !vars %in% colnames(d))) {
      if (all(su)) cli_abort("no variables found in file {.file {f}}")
      if (any(!spec[su])) {
        cli_abort(
          "table from {.file {f}} does not have {?a column name/column names} {.var {vars[su][!spec[su]]}}"
        )
      }
      vars <- vars[!su]
      spec <- spec[!su]
    }
    names <- c(names, list(colnames(d)))
    set(d, NULL, "file", f)
    d[[value_name]] <- paste0(
      sub("^.*[\\\\/]", "", gsub("^.*\\d{4}(?:q\\d)?_|\\.\\w{3,4}$", "", f)), ":", d[[value_name]]
    )
    data <- c(data, list(d))
  }
  common <- Reduce(intersect, names)
  if (!value %in% vars) {
    a <- common[!common %in% vars]
    if (!length(a)) cli_abort("could not figure out which column might contain values")
    if (length(a) > 1) {
      a <- a[which(vapply(a, function(col) is.numeric(d[[col]])))]
      if (!length(a)) {
        cli_abort(c(
          "no potential value columns were numeric",
          i = "check variable classes, or specify {.arg value}"
        ))
      }
      value <- a[1]
      vars <- c(value, vars)
    }
  }
  vars <- c(vars, "file")
  data <- do.call(rbind, lapply(data, function(d) d[, vars, with = FALSE]))
  if (!id %in% vars) {
    id <- "id"
    vars <- c(id, vars)
    data <- cbind(id = unlist(lapply(table(data$file), seq_len), use.names = FALSE), data)
  }
  data[[id]] <- as.character(data[[id]])
  if (!dataset %in% vars) {
    dataset <- "dataset"
    data <- cbind(data, dataset = "dataset")
  }
  if (!time %in% vars) {
    time <- "time"
    data <- cbind(data, time = 1)
  }
  if (!any(value_name %in% vars)) {
    value_name <- "file"
  }
  data[[dataset]] <- gsub("\\s+", "_", data[[dataset]])
  datasets <- unique(data[[dataset]])
  variables <- unique(data[[value_name]])
  times <- sort(unique(data[[time]]))
  entity_info <- entity_info[entity_info %in% colnames(data)]
  if (all(nchar(times) == 4)) times <- seq(min(times), max(times))
  sets <- lapply(datasets, function(dn) {
    d <- if (dataset %in% vars) data[data[[dataset]] == dn] else data
    if (anyDuplicated(d[[id]])) {
      do.call(rbind, lapply(unique(d[[id]]), function(e) {
        ed <- d[d[[id]] == e]
        r <- data.frame(ID = rep(as.character(e), length(times)), time = times)
        # for(v in entity_info) r[[v]] <- ed[[v]][1]
        rownames(r) <- times
        for (v in variables) {
          r[[v]] <- NA
          su <- ed[[value_name]] == v & !is.na(ed[[value]])
          if (sum(su)) {
            vals <- ed[su]
            r[as.character(vals[[time]]), v] <- vals[[value]]
          }
        }
        r
      }))
    } else {
      d
    }
  })
  datasets <- gsub("\\s+", "_", tolower(datasets))
  names(sets) <- datasets
  if (!is.null(out)) {
    for (f in datasets) {
      write.csv(sets[[f]], paste0(out, "/", f, ".csv"), row.names = FALSE)
    }
    if (interactive()) {
      cli_bullets(c(
        v = "Reformatted data files written:",
        structure(paste0("{.file ", out, "/", datasets, ".csv}"), names = rep("*", length(datasets)))
      ))
    }
  }
  invisible(sets)
}
