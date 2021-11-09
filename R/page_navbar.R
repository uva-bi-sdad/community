#' Add a navbar (header) section to a website
#'
#' Adds a bar at the top of the page, potentially with a title and logo image.
#'
#' @param title A title to appear in the header.
#' @param logo URL of an image to appear in the header.
#' @param ... Lists specifying submenus and their items. Each list should have entries for
#' \code{"name"} (the navbar button text), \code{"title"} (the menu title), \code{"placement"}
#' (start, top, end, or bottom), \code{"backdrop"} (logical), and \code{items} (a list of menu items).
#' @examples
#' page_navbar(
#'   "Site Name",
#'   submenus = list(
#'     name = "menu",
#'     title = "Menu",
#'     items = list(input_select("menu select", c("a", "b")))
#'   )
#' )
#' @return A character vector of the content to be added.
#' @export

page_navbar <- function(title = "", logo = "", ...) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  parts <- new.env()
  attr(parts, "name") <- "community_site_parts"
  submenus <- substitute(...())
  n <- length(submenus)
  parts$uid <- caller$uid
  r <- c(
    '<div class="navbar-header" role="heading" aria-level="1">',
    '<div class="container-fluid">',
    if (!missing(logo)) paste0('<span class="navbar-logo"><img alt="site logo" src="', logo, '"></span>'),
    if (!missing(title)) paste0('<span class="navbar-brand">', title, "</span>"),
    "</div>",
    "</div>"
  )
  menus <- NULL
  if (n) {
    for (i in seq_len(n)) {
      id <- paste0("submenu", parts$uid, i)
      if (is.null(submenus[[i]]$name)) submenus[[i]]$name <- "Menu"
      r <- c(r, paste0(
        '<button class="btn btn-link" type="button" data-bs-toggle="offcanvas" data-bs-target="#',
        id, '" aria-control="', id, '">', submenus[[i]]$name, "</button>"
      ))
      menus <- c(
        menus,
        paste(c(
          '<div tabindex="-1" id="', id, '" aria-labelledby="', id, '_label" class="offcanvas offcanvas-',
          if (is.null(submenus[[i]]$placement)) "end" else submenus[[i]]$placement,
          if (!is.null(submenus[[i]]$backdrop)) c('" data-bs-backdrop="', submenus[[i]]$backdrop),
          '">'
        ), collapse = ""),
        '<div class="offcanvas-header">',
        paste0(
          '<h5 class="offcanvas-title" id="', id, '_label">',
          submenus[[i]][if (is.null(submenus[[i]]$title)) "name" else "title"],
          "</h5>"
        ),
        '<button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas" title="Close"></button>',
        "</div>",
        '<div class="offcanvas-body">',
        unlist(lapply(submenus[[i]]$items[-1], eval, parts), use.names = FALSE),
        "</div>"
      )
    }
  }
  r <- c(r, "</div>", menus)
  if (building) {
    caller$header <- r
    for (n in names(parts)) if (n != "content" && n != "uid") caller[[n]] <- c(caller[[n]], parts[[n]])
    caller$uid <- parts$uid + 1
  }
  r
}
