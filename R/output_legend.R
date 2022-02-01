#' Adds a legend to a website
#'
#' Adds a legend based on a specified color palette.
#'
#' @param palette Name of an included color palette (from
#' \href{https://colorbrewer2.org}{colorbrewer}); one of \code{"rdylbu7"} (default), \code{"orrd7"}, \code{"gnbu7"},
#' \code{"brbg7"}, \code{"puor7"}, \code{"prgn6"}, \code{"reds5"}, \code{"greens5"}, \code{"greys4"}, \code{"paired4"}.
#' @param lower Text to appear at the beginning of the legend, labeling smaller.
#' @param center Text to appear at the midpoint of the legend, labeling central values.
#' @param higher Text to appear at the end of the legend, labeling larger values.
#' @param dataview The ID of an \code{\link{input_dataview}} component.
#' @param id Unique ID of the legend element.
#' @param subto A vector of output IDs to receive hover events from.
#' @param class Class names to add to the legend element.
#' @examples
#' output_legend()
#' @return A character vector of the contents to be added.
#' @export

output_legend <- function(palette = "", lower = "Lower", higher = "Higher",
                          dataview = NULL, id = NULL, subto = NULL, class = "") {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  if (is.null(id)) id <- paste0("legend", caller$uid)
  options <- list(palette = palette, subto = subto)
  r <- c(
    paste(c(
      '<div id="', id, '" auto-type="legend" class="auto-output legend',
      if (class != "") c(" ", class), '"',
      if (!is.null(dataview)) paste0(' data-view="', dataview, '"'),
      ">"
    ), collapse = ""),
    '<div class="legend-ticks"></div>',
    '<div class="legend-scale"></div>',
    paste0(
      '<div class="legend-text"><span>', lower, "</span><span></span><span>", higher, "</span></div>"
    ),
    "</div>"
  )
  if (building) {
    caller$legends[[id]] <- options
    caller$content <- c(caller$content, r)
    caller$uid <- caller$uid + 1
  }
  r
}
