#' Document a dataset
#'
#' Add information about variables in a dataset to a \code{datapackage.json} metadata file.
#'
#' @param path A character vector of paths to tabular data files.
#' @param package_path Package to add the metadata to; path to the .json file, or a list with the read-in version.
#' @param write Logical; if \code{FALSE}, returns the \code{paths} metadata without reading or rewriting \code{package}.
#' @examples
#' \dontrun{
#' # write example data
#' write.csv(mtcars, "mtcars.csv")
#'
#' # add it to an existing datapackage.json file in the current working directory
#' add_data("mtcars.csv")
#' }
#' @return A version of the metadata, which is also added to \code{datapackage.json} if \code{write = TRUE}.
#' @seealso Initialize the datapackage.json file with \code{\link{init_data}}.
#' @export

add_data <- function(path, package_path = "datapackage.json", write = TRUE) {
  if (missing(path)) cli_abort("{.arg path} must be specified")
  if (any(!file.exists(path))) cli_abort("{?a path/paths} did not exist: {path[!file.exists(path)]}")
  package <- package_path
  if (write) {
    if (is.character(package)) {
      if (file.exists(package)) {
        package <- read_json(package_path)
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
  collect_metadata <- function(f) {
    name <- basename(f)
    info <- file.info(f)
    header <- readLines(f, 1)
    data <- tryCatch(fread(f), error = function(e) NULL)
    list(
      bytes = as.integer(info$size),
      encoding = stri_enc_detect(f)[[1]][1, 1],
      hash = md5sum(f)[[1]],
      format = strsplit(name, ".", fixed = TRUE)[[1]][2],
      name = name,
      profile = "data-resource",
      created = as.character(info$mtime),
      last_modified = as.character(info$ctime),
      rowcount = nrow(data),
      schema = list(
        fields = lapply(colnames(data), function(cn) {
          v <- data[[cn]]
          r <- list(name = cn)
          if (is.numeric(v)) {
            r$type <- "number"
            r$missing <- sum(!is.finite(v))
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
  }
  metadata <- lapply(path, collect_metadata)
  if (write) {
    package$resources <- c(if (length(package$resources)) package$resources[[1]] else NULL, metadata)
    package_path <- if (is.character(package_path)) package_path else "datapackage.json"
    write_json(package, package_path, pretty = TRUE, auto_unbox = TRUE, digits = 6)
    if (interactive()) {
      cli_bullets(c(v = "added resource to {.file datapackage.json}:", "*" = paste0("{.path ", package_path, "}")))
      navigateToFile(package_path)
    }
  }
  metadata
}
