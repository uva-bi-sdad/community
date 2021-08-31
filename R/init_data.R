#' Create a datapackage.json template
#'
#' Initialize dataset documentation with a \code{datapackage.json} template, based on a
#' \href{Data Package}{https://specs.frictionlessdata.io/data-package} standard.
#'
#' @param name A unique name for the dataset; allowed characters are \code{\[a-z._/-\]}.
#' @param title A display name for the dataset; if not specified, will be a formatted version of \code{name}.
#' @param dir Directory in which to save the \code{datapackage.json} file.
#' @param sources A list of source (with ).
#' @param data_paths A character vector of data files to add; passed to \code{\link{add_data}}.
#' @param write Logical; if \code{FALSE}, the package object will not be written to a file.
#' @param overwrite Logical; if \code{TRUE} and \code{write} is \code{TRUE}, an existing
#' \code{datapackage.json} file will be overwritten.
#' @examples
#' \dontrun{
#' # make a template datapackage.json file in the current working directory
#' init_data("mtcars", "Motor Trend Car Road Tests")
#' }
#' @return An invisible list with the content written to the \code{datapackage.json} file.
#' @seealso Add basic information about a dataset with \code{\link{add_data}}.
#' @export

init_data <- function(name, title = name, dir = ".", sources = NULL, data_paths = character(),
                      write = TRUE, overwrite = FALSE) {
  if (missing(name)) cli_abort("{.arg name} must be specified")
  package <- list(
    name = name,
    title = if (title == name) gsub("\\b(\\w)", "\\U\\1", gsub("[._/-]", " ", name), perl = TRUE) else title,
    licence = list(
      url = "http://opendatacommons.org/licenses/pddl",
      name = "Open Data Commons Public Domain",
      version = "1.0",
      id = "odc-pddl"
    ),
    sources = list(),
    resources = list()
  )
  if (!missing(sources)) {
    package$source <- if (is.list(sources[[1]])) sources else list(sources)
  }
  path <- normalizePath(paste0(dir, "/datapackage.json"), "/", FALSE)
  if (write && !overwrite && file.exists(path)) {
    cli_abort(c("datapackage ({.path {path}}) already exists", i = "add {.code overwrite = TRUE} to overwrite it"))
  }
  if (!missing(data_paths)) {
    check_paths <- file.exists(data_paths)
    if (any(!check_paths)) {
      for (i in which(!check_paths)) {
        if (file.exists(paste0(path, "/", data_paths[i]))) {
          data_paths[i] <- paste0(path, "/", data_paths[i])
          check_paths[i] <- TRUE
        }
      }
      data_paths <- data_paths[check_paths]
    }
    if (length(data_paths)) {
      package$resources <- add_data(data_paths, write = FALSE)
    }
  }
  if (write) {
    write_json(package, path, auto_unbox = TRUE, pretty = TRUE, digits = 6)
    if (interactive()) {
      cli_bullets(c(v = "created metadata template for {name}:", "*" = paste0("{.path ", path, "}")))
      navigateToFile(path)
    }
  }
  invisible(package)
}
