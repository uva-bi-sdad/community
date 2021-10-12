#' Add a tooltip-like display to a website
#'
#' Adds an output to display information about a hovered-over or selected data point.
#'
#' @param title Default title at the top of the element.
#' @param message Default message below the title, to be replaced by the information table.
#' @param dataview The ID of a dataview, used for the persistent display.
#' @param subto A vector of output IDs to receive hover events from.
#' @examples
#' \dontrun{
#' output_info("Initial View", "Hover over plot elements for more information.")
#' }
#' @return A character vector of the content to be added.
#' @export

output_info <- function(title = "Overall", message = "", dataview = NULL, subto = NULL) {
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
        paste0("<h1>", title, "</h1>"),
        if (cl == "") paste0("<p>", message, "</p>"),
        '<table class="table location-table hidden"></table>',
        "</div>"
      )
    }), use.names = FALSE),
    "</div>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) &&
    attr(caller, "name") == "community_site_parts") {
    caller$content <- c(caller$content, r)
    if (!is.null(subto)) {
      if (is.null(attr(caller, "info"))) caller$info <- list()
      id <- length(caller$info)
      caller$info[[paste0("info", id)]] <- list(subto = subto)
    }
  }
  r
}
