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
#' @param class Class names to add to the table.
#' @examples
#' \dontrun{
#' output_table()
#' }
#' @return A character vector of the content to be added.
#' @export

output_table <- function(variables = NULL, dataset = NULL, dataview = NULL, options = NULL, class = "compact") {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  id <- caller$uid
  options$variables <- variables
  options$dataset <- dataset
  r <- paste(c(
    paste0('<table class="auto-output datatables', if (is.null(class)) "" else paste("", class), '"'),
    if (!is.null(dataview)) paste0('data-view="', dataview, '"'),
    paste0('id="table', id, '"'),
    'auto-type="table"></table>'
  ), collapse = " ")
  if (building) {
    caller$dependencies$jquery <- list(
      type = "script",
      src = "https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
      hash = "sha384-vtXRMe3mGCbOeY7l30aIg8H9p3GdeSe4IFlP6G8JMa7o7lXvnz3GFKzPxzJdPfGK",
      loading = "defer"
    )
    caller$dependencies$datatables_style <- list(
      type = "stylesheet",
      src = "https://cdn.datatables.net/1.11.3/css/jquery.dataTables.min.css",
      hash = "sha384-kKpyGTkmY+nYEkRda6qauvrYqFNO4csWTLspXM3FCJ89NsU9FhPY5kebmiPqu8B6"
    )
    caller$dependencies$datatables <- list(
      type = "script",
      src = "https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.11.3/b-2.0.1/b-html5-2.0.1/b-print-2.0.1/sc-2.0.5/datatables.min.js",
      hash = "sha384-4q2LU0R9C7vB+N95b9FJKZtKoi5qPnfhka2e2ke4/QXRRcywBg478wvxJQQ2whZT",
      loading = "defer"
    )
    caller$tables[[paste0("table", id)]] <- options
    caller$content <- c(caller$content, r)
    caller$uid <- caller$uid + 1
  }
  r
}
