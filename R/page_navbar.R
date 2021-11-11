#' Add a navbar (header) section to a website
#'
#' Adds a bar at the top of the page, potentially with a title and logo image.
#'
#' @param title A title to appear in the header.
#' @param logo URL of an image to appear in the header.
#' @param ... Lists specifying submenus and their items. Each list should have entries for
#' \code{"name"} (the navbar button text), \code{"title"} (the menu title), \code{"placement"}
#' (start, top, end, or bottom), \code{"backdrop"} (logical), and \code{items} (a list of menu items).
#' @param breakpoint Bootstrap breakpoint code specifying the width at which the menu collapses;
#' default is \code{"md"}.
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

page_navbar <- function(title = "", logo = "", ..., breakpoint = "md") {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  parts <- new.env()
  attr(parts, "name") <- "community_site_parts"
  submenus <- substitute(...())
  n <- length(submenus)
  parts$uid <- caller$uid
  r <- c(
    paste0('<nav class="navbar navbar-dark navbar-expand-', breakpoint, '">'),
    '<div class="container-fluid">',
    if (!missing(logo)) paste0('<span class="navbar-brand"><img alt="site logo" src="', logo, '">'),
    if (!missing(title)) title,
    if (!missing(logo)) "</span>"
  )
  menus <- NULL
  if (n) {
    r <- c(
      r,
      paste0(
        '<button type="button" class="navbar-toggler" data-bs-toggle="collapse"',
        'data-bs-target="#navbar_menu"',
        'aria-controls="narbar_menu" aria-expanded="false" aria-lable="toggle navbar menu">'
      ),
      '<span class="navbar-toggler-icon"></span>',
      "</button>",
      '<div class="collapse navbar-collapse" id="navbar_menu">',
      '<ul class="navbar-nav">'
    )
    for (i in seq_len(n)) {
      id <- paste0("submenu", parts$uid, i)
      if (is.null(submenus[[i]]$name)) submenus[[i]]$name <- "Menu"
      r <- c(r, paste0(
        '<li class="nav-item">',
        '<button class="btn btn-link" type="button" data-bs-toggle="offcanvas" data-bs-target="#',
        id, '" aria-control="', id, '">', submenus[[i]]$name, "</button>",
        "</li>"
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
        "</div>",
        "</div>"
      )
    }
  }
  r <- c(r, "</ul></div></div></nav>", menus)
  if (building) {
    caller$header <- r
    for (n in names(parts)) if (n != "content" && n != "uid") caller[[n]] <- c(caller[[n]], parts[[n]])
    caller$uid <- parts$uid + 1
  }
  r
}
