#' Adds a legend to a website
#'
#' Adds a legend based on a specified color palette.
#'
#' @param palette Name of an included color palette (from
#' \href{https://colorbrewer2.org}{colorbrewer}); one of \code{"divergent"} (default), \code{"reds"},
#' \code{"greens"}, \code{"grays"}, or \code{"cat"}.
#' @param lower Text to appear at the beginning of the legend, labeling smaller.
#' @param center Text to appear at the midpoint of the legend, labeling central values.
#' @param higher Text to appear at the end of the legend, labeling larger values.
#' @param class Class names to add to the legend table.
#' @examples
#' \dontrun{
#' output_legend("reds")
#' }
#' @return A character vector of the contents to be added.
#' @export

output_legend <- function(palette = "divergent", lower = "Lower", center = "", higher = "Higher", class = "") {
  r <- c(
    paste(c('<table palette="', palette, '" class="legend', if (class != "") c(" ", class), '">'), collapse = ""),
    '<tr><td colspan=3 class="legend-scale"></td></tr>',
    paste0("<tr><td>", lower, "</td><td>", center, "</td><td>", higher, "</td></tr>"),
    "</table>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") {
    caller$content <- c(caller$content, r)
  }
  r
}
