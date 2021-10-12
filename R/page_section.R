#' Adds a row or column to a website
#'
#' Adds a row or column section to a website, optionally placing their elements within rows or columns.
#'
#' @param ... Elements to appear in the menu.
#' @param type The class of the top-level section; either \code{"row"} or \code{"column"}.
#' @param wraps The class of wrapper to place elements in; either \code{"row"}, \code{"column"}, or \code{""}
#' (to not wrap the element). Can specify 1 for every element, or a different class for each element.
#' @param sizes The relative size of each wrapper, between 1 and 12, or \code{"auto"}; default is equal size.
#' @param breakpoints Bootstrap breakpoint of each wrapper; one of \code{""} (extra small), \code{"sm"},
#' \code{"md"}, \code{"lg"}, \code{"xl"}, or \code{"xxl"}.
#' @details See the \href{https://getbootstrap.com/docs/5.1/layout/grid}{Bootstrap grid documentation}.
#' @examples
#' \dontrun{
#' page_section(
#'   "<p>column</p>",
#'   "<p>row</p>",
#'   type = "row",
#'   wraps = c("column", "row")
#' )
#' }
#' @return A character vector of the content to be added.
#' @export

page_section <- function(..., type = "row", wraps = NA, sizes = NA, breakpoints = NA) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  parts <- new.env()
  attr(parts, "name") <- "community_site_parts"
  elements <- substitute(...())
  n <- length(elements)
  wraps <- rep_len(wraps, n)
  sizes <- rep_len(sizes, n)
  breakpoints <- rep_len(breakpoints, n)
  r <- c(
    paste0('<div class="', if (grepl("^r", type)) "row" else "col", '">'),
    unlist(lapply(seq_len(n), function(i) {
      c(
        if (!is.na(wraps[i])) {
          paste(c(
            '<div class="', if (grepl("^r", wraps[i])) "row" else "col",
            if (!is.na(breakpoints[i])) c("-", breakpoints[i]),
            if (!is.na(sizes[i])) c("-", sizes[i]),
            '">'
          ), collapse = "")
        },
        eval(elements[[i]], parts),
        if (!is.na(wraps[i])) "</div>"
      )
    }), use.names = FALSE),
    "</div>"
  )
  if (building) {
    caller$content <- c(caller$content, r)
    for (n in names(parts)) if (n != "content") caller[[n]] <- c(caller[[n]], parts[[n]])
  }
  r
}
