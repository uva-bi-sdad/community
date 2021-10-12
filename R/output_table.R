#' Add a table to a webpage
#'
#' Adds a DataTables table to a webpage, based on specified or selected .
#'
#' @param variables Variable names in the included data, or the ID of a
#' variable selector to show in columns of the table.
#' @param dataset The name of a dataset, or ID of a dataset selector, to find \code{variables} in;
#' used if \code{dataview} is not specified.
#' @param dataview The ID of an \code{\link{input_dataview}} component.
#' @param options A list of configuration options, see
#' \href{https://datatables.net/reference/option}{DataTables Documentation}.
#' @examples
#' \dontrun{
#' output_table()
#' }
#' @return A character vector of the content to be added.
#' @export

output_table <- function(variables = NULL, dataset = NULL, dataview = NULL, options = NULL) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  id <- 0
  options$variables <- variables
  options$dataset <- dataset
  if (building) {
    caller$dependencies$jquery <- list(
      type = "script",
      src = "https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
      hash = "sha384-vtXRMe3mGCbOeY7l30aIg8H9p3GdeSe4IFlP6G8JMa7o7lXvnz3GFKzPxzJdPfGK",
      loading = "defer"
    )
    caller$dependencies$datatables_style <- list(
      type = "stylesheet",
      src = "https://cdn.datatables.net/v/bs5/dt-1.11.3/datatables.min.css",
      hash = "sha384-l2hamNU6eJD6dVT4FGeSK8OL3lmN1BLH2KD8wasA7RIKAqLjMQl1wtY97p2TVGQX"
    )
    caller$dependencies$datatables <- list(
      type = "script",
      src = "https://cdn.datatables.net/v/bs5/dt-1.11.3/datatables.min.js",
      hash = "sha384-vMizDKeY0PRwYLZfb7o226IbTYSHZZSJ8iH3TX3xNT8ydJ9G4vUNLHtUkUPHDNI6",
      loading = "defer"
    )
    if (is.null(attr(caller, "tables"))) caller$tables <- list()
    id <- length(caller$tables)
    caller$tables[[paste0("table", id)]] <- options
  }
  r <- paste(c(
    '<table class="auto-output datatables"',
    if (!is.null(dataview)) paste0('data-view="', dataview, '"'),
    paste0('id="table', id, '"'),
    'auto-type="table"></table>'
  ), collapse = " ")
  if (building) caller$content <- c(caller$content, r)
  r
}
