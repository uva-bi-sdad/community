#' Adds a legend to a website
#'
#' Adds a legend based on a specified color palette.
#'
#' @param add A list of credits to add. Each credit should be a list with at least entries for \code{"name"}
#' and \code{"url"}, and optionally a \code{"version"} and/or \code{"description"}.
#' @param exclude Names of automatic credits to exclude. The automatic credits are \code{"bootstrap"},
#' \code{"leaflet"} (from \code{\link{output_map}}), \code{"plotly"} (from \code{\link{output_plot}}), and
#' \code{"datatables"} (from \code{\link{output_table}}).
#' @examples
#' \dontrun{
#' output_legend("reds")
#' }
#' @return A character vector of the contents to be added.
#' @export

output_credits <- function(add = NULL, exclude = NULL) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  id <- paste0("credits", caller$uid)
  r <- paste0('<div id="', id, '" class="auto-output credits" auto-type="credits"></div>')
  if (building) {
    caller$content <- c(caller$content, r)
    if (!is.null(add) || !is.null(exclude)) caller$credit_output[[id]] <- list(add = add, exclude = exclude)
    caller$uid <- caller$uid + 1
  }
  r
}
