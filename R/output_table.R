#' Add a table to a webpage
#'
#' Adds a DataTables table to a webpage, based on specified or selected variables.
#'
#' @param variables The ID of a variable selecting input, or a list specifying columns (if \code{wide} is
#' \code{TRUE}) or included variables. Each entry should be a list with at least have a \code{name} entry with a
#' variable name. A \code{title} entry can be used to set a different display name for the variable. \code{name}
#' can also refer to feature names, which can be specified with a \code{source} entry set to \code{"features"}.
#' For example, \code{list(title = "Variable A", name = "a", source = "features")}. A vector can also be used
#' to specify variable names, with names setting titles (e.g., \code{c("Variable A" = "a")}). If not specified,
#' sources are attempted to be resolved automatically.
#' @param dataset The name of a dataset, or ID of a dataset selector, to find \code{variables} in;
#' used if \code{dataview} is not specified.
#' @param dataview The ID of an \code{\link{input_dataview}} component.
#' @param id Unique ID of the table.
#' @param click The ID of an input to set to a clicked row's entity ID.
#' @param subto A vector of output IDs to receive hover events from.
#' @param options A list of configuration options if \code{datatables} is \code{TRUE}, see
#' \href{https://datatables.net/reference/option}{DataTables Documentation}.
#' @param features A list of features columns to include if multiple variables are included and \code{wide} is
#' \code{TRUE}.
#' @param filters A list with names of \code{meta} entries (from \code{variable} entry in \code{\link{data_add}}'s
#' \code{meta} list), and values of target values for those entries, or the IDs of value selectors.
#' @param wide Logical; if \code{FALSE}, variables and years are spread across rows rather than columns.
#' If \code{variables} specifies a single variable, \code{wide = FALSE} will show the variable in a column, and
#' \code{wide = TRUE} will show the variable across time columns.
#' @param class Class names to add to the table.
#' @param datatables Logical; if \code{TRUE}, uses \href{https://datatables.net}{DataTables}.
#' @examples
#' output_table()
#' @return A character vector of the content to be added.
#' @export

output_table <- function(variables = NULL, dataset = NULL, dataview = NULL, id = NULL, click = NULL, subto = NULL,
                         options = NULL, features = NULL, filters = NULL, wide = TRUE, class = "compact", datatables = TRUE) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  if (is.null(id)) id <- paste0("table", caller$uid)
  type <- if (datatables) "datatable" else "table"
  r <- paste(c(
    paste0('<table class="auto-output datatables', if (is.null(class)) "" else paste("", class), '"'),
    if (!is.null(dataview)) paste0('data-view="', dataview, '"'),
    if (!is.null(click)) paste0('click="', click, '"'),
    paste0('id="', id, '" auto-type="', type, '"></table>')
  ), collapse = " ")
  if (building) {
    if (!is.null(variables)) {
      if (!is.character(variables) || length(variables) > 1) {
        if (!is.list(variables)) {
          variables <- as.list(variables)
        } else if (!is.list(variables[[1]])) variables <- list(variables)
        vnames <- names(variables)
        for (i in seq_along(variables)) {
          if (is.null(names(variables[[i]]))) variables[[i]] <- list(name = variables[[i]][[1]])
          if (!is.null(vnames[i])) variables[[i]]$title <- vnames[i]
        }
      }
      options$variables <- variables
    }
    if (!is.null(features)) {
      if (!is.character(features) || length(features) > 1) {
        if (!is.list(features)) {
          features <- as.list(features)
        } else if (!is.list(features[[1]]) && "name" %in% names(features)) features <- list(features)
        vnames <- names(features)
        for (i in seq_along(features)) {
          if (is.null(names(features[[i]]))) features[[i]] <- list(name = features[[i]][[1]])
          if (!is.null(vnames[i])) features[[i]]$title <- vnames[i]
        }
      }
      options$features <- unname(features)
    }
    options$subto <- if (!is.null(subto) && length(subto) == 1) list(subto) else subto
    options$filters <- filters
    options$dataset <- dataset
    options$single_variable <- wide && length(variables) == 1
    options$wide <- if (!wide && length(variables) == 1) TRUE else wide
    defaults <- list(
      paging = TRUE, scrollY = 500, scrollX = 500, scrollCollapse = TRUE,
      scroller = TRUE, deferRender = TRUE
    )
    so <- names(options)
    for (n in names(defaults)) if (!n %in% so) options[[n]] <- defaults[[n]]
    if (datatables) {
      caller$dependencies$jquery <- list(
        type = "script",
        src = "https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
        hash = "sha384-vtXRMe3mGCbOeY7l30aIg8H9p3GdeSe4IFlP6G8JMa7o7lXvnz3GFKzPxzJdPfGK",
        loading = "defer"
      )
      caller$dependencies$datatables_style <- list(
        type = "stylesheet",
        src = "https://cdn.datatables.net/1.13.1/css/jquery.dataTables.min.css",
        hash = "sha384-L5rLJDVZhrHrRIaa3eLLU/uLS3+3gVzd1vFs4wVyufS93DmLRAdBySoFzqFDwuQJ"
      )
      caller$dependencies$datatables <- list(
        type = "script",
        src = "https://cdn.datatables.net/v/dt/dt-1.13.1/b-2.3.3/b-html5-2.3.3/sc-2.0.7/datatables.min.js",
        hash = "sha384-O2FpoJcGICEo4Rb6D0WP71bCQGdsDN+v1dWjJQ4iJXQBH611u8Z5Lli/Unxz5jk4",
        loading = "defer"
      )
      caller$credits$datatables <- list(
        name = "DataTables",
        url = "https://datatables.net",
        version = "1.13.1"
      )
    }
    if (datatables) caller$datatable[[id]] <- options else caller$table[[id]] <- options
    caller$content <- c(caller$content, r)
    caller$uid <- caller$uid + 1
  }
  r
}
