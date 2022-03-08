#' Map Data Commons Variables
#'
#' Extract variables from files in datacommons repositories
#'
#' @param dir Directory of the data commons projects.
#' @param search_pattern A regular expression string used be passed to \code{\link{list.files}}.
#' @param variable_location The name of a column contain variable names in each dataset, or a function to retrieve
#' variable names (e.g., \code{colnames}).
#' @param reader A function capable of handling a connection in its first argument, which returns a matrix-like object.
#' @param overwrite Logical; if \code{TRUE}, creates a new map even if one exists.
#' @param quiet Logical; if \code{TRUE}, supresses messages.
#' @examples
#' \dontrun{
#' # from a data commons project directory
#' map <- datacommons_map_variables(".")
#' }
#' @return An invisible \code{data.frame} of the mapped variables, with \code{variable} (variable name),
#' \code{full_name} (variable name with a prefix from the file's name), and \code{file} (path to the file) columns.
#' @export

datacommons_map_variables <- function(dir, search_pattern = "\\.csv\\.xz", variable_location = "measure",
                                      reader = read.csv, overwrite = FALSE, quiet = FALSE) {
  if (missing(dir)) cli_abort("{.arg dir} must be specified")
  if (!dir.exists(paste0(dir, "/repos"))) {
    cli_abort(c(
      x = "no {.path repos} directory found in {.arg dir}",
      i = paste0('use {.code datacommons_refresh("', dir, '")} to bring in remote data')
    ))
  }
  files <- list.files(paste0(dir, "/", c("cache", "repos")), search_pattern, recursive = TRUE, full.names = TRUE)
  if (!length(files)) cli_abort("no files were found")
  files <- files[!duplicated(basename(files))]
  res <- paste0(dir, "/cache/variable_map.csv")
  if (overwrite) unlink(res)
  if (file.exists(res)) {
    return(invisible(read.csv(res)))
  }
  i <- 1
  if (!quiet) cli_progress_step("scanning files: {i}/{length(files)}", msg_done = "created variables map: {.file {res}}", spinner = TRUE)
  map <- list()
  noread <- novars <- NULL
  for (i in seq_along(files)) {
    f <- files[[i]]
    d <- tryCatch(reader(if (grepl("[gbx]z2?$", f)) gzfile(f) else f, 1), error = function(e) NULL)
    if (!is.null(d)) {
      if (!is.character(variable_location) || variable_location %in% colnames(d)) {
        vars <- unique(if (is.factor(variable_location)) variable_location(d) else d[, variable_location, drop = TRUE])
        map[[f]] <- data.frame(variable = vars, full_name = sub("^:", "", paste0(
          sub("^.*[\\\\/]", "", gsub("^.*\\d{4}(?:q\\d)?_|\\.\\w{3,4}$|\\..*$", "", basename(f))), ":", vars
        )), file = f)
      } else {
        novars <- c(novars, f)
      }
    } else {
      noread <- c(noread, f)
    }
    if (!quiet) cli_progress_update()
  }
  map <- do.call(rbind, unname(map))
  if (!quiet) {
    if (length(noread)) cli_warn("file{?s} could not be read in: {.file {noread}}")
    if (length(novars)) cli_warn("{.arg {variable_location}} was not in {?some files'/a file's} column names: {.file {novars}}")
  }
  dir.create(paste0(dir, "/cache"), FALSE)
  write.csv(map, paste0(dir, "/cache/variable_map.csv"), row.names = FALSE)
  invisible(map)
}
