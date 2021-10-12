#' Add a navbar (header) section to a website
#'
#' Adds a bar at the top of the page, potentially with a title and logo image.
#'
#' @param title A title to appear in the header.
#' @param logo URL of an image to appear in the header.
#' @param ... Adds additional elements to the header, after the title section.
#' @examples
#' page_navbar("Site Name")
#' @return A character vector of the content to be added.
#' @export

page_navbar <- function(title = "", logo = "", ...) {
  r <- unlist(lapply(list(...), as.character), use.names = FALSE)
  if (!missing(title) || !missing(logo)) {
    r <- c(
      '<div class="navbar-header" role="heading" aria-level="1">',
      '<div class="container-fluid">',
      if (!missing(logo)) paste0('<span class="navbar-logo"><img alt="site logo" src="', logo, '"></span>'),
      if (!missing(title)) paste0('<span class="navbar-brand">', title, "</span>"),
      "</div></div>",
      r
    )
  }
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") caller$header <- r
  r
}
