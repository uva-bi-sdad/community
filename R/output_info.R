#' Add a tooltip-like display to a website
#'
#' Adds an output to display information about a hovered-over or selected data point.
#'
#' @param title Title text, or the source of title text.
#' @param body A list of entries in the info body section, which can be raw text or references to features or
#' data variables. Named entries appear in two columns, with the name in the first.
#' @param variable_info A list with entries for \code{"title"} and \code{"body"}, which can be raw text or reference
#' to variable metadata entries.
#' @param default A list with entries for \code{"title"} and \code{"body"}, which are treated as raw text.
#' @param dataview The ID of a dataview, used for the persistent display.
#' @param subto A vector of output IDs to receive hover events from.
#' @examples
#' \dontrun{
#' output_info("Initial View", "Hover over plot elements for more information.")
#' }
#' @return A character vector of the content to be added.
#' @export

output_info <- function(title = "features.name", body = "value",
                        variable_info = list(title = "short_name", body = "short_description"),
                        default = c(title = "Overall", body = "No selection."), dataview = NULL, subto = NULL) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  id <- 0
  r <- c(
    paste(c(
      '<div class="auto-output text-display" auto-type="info"',
      paste0(' id="info', id, '"'),
      if (!is.null(dataview)) paste0(' data-view="', dataview, '"'),
      ">"
    ), collapse = ""),
    unlist(lapply(c("", "hidden"), function(cl) {
      c(
        paste0('<div class="', cl, '">'),
        paste0('<p class="h2">', if (is.na(default["title"])) "" else default["title"], "</p>"),
        if (cl == "") paste0("<p>", if (is.na(default["body"])) "" else default["body"], "</p>"),
        '<table class="table location-table hidden"></table>',
        "</div>"
      )
    }), use.names = FALSE),
    '<div class="variable-info"></div>',
    "</div>"
  )
  if (building) {
    caller$content <- c(caller$content, r)
    if (!is.null(subto)) {
      id <- length(caller$info)
      caller$info[[paste0("info", id)]] <- list(
        title = title, body = lapply(seq_along(body), function(i) {
          list(name = names(body)[i], value = body[[i]])
        }), variable_info = as.list(variable_info),
        default = as.list(default), subto = subto
      )
    }
  }
  r
}
