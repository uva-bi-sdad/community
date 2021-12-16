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
#' @param class Class names to add to the legend table.
#' @examples
#' output_legend()
#' @return A character vector of the contents to be added.
#' @export

output_legend <- function(palette = "", lower = "Lower", center = "", higher = "Higher", class = "") {
  r <- c(
    paste(c('<div palette="', palette, '" class="legend', if (class != "") c(" ", class), '">'), collapse = ""),
    '<div class="legend-scale"></div>',
    paste0('<div class="legend-text"><span>', lower, "</span><span>", center, "</span><span>", higher, "</span></div>"),
    "</div>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") {
    caller$content <- c(caller$content, r)
  }
  r
}
