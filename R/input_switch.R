#' Add a single switch or checkbox to a website
#'
#' Adds a single toggle, displayed as a switch or checkbox to a website.
#'
#' @param label Label of the input for the user.
#' @param id Unique id of the element to be created.
#' @param ... Additional attributes to set on the element.
#' @param default_on Logical; if \code{TRUE}, the switch will start on.
#' @param as.checkbox Logical; if \code{TRUE}, display the switch as a checkbox.
#' @examples
#' \dontrun{
#' input_switch("Label")
#' }
#' @return A character vector of the contents to be added.
#' @seealso For a group of switches, checkboxes, or radio buttons, use \code{\link{input_checkbox}}.
#' @export

input_switch <- function(label, id = label, ..., default_on = FALSE, as.checkbox = FALSE) {
  id <- gsub("\\s", "", id)
  a <- list(...)
  r <- c(
    paste0(
      '<div class="wrapper switch-wrapper"', 
      if (length(a)) unlist(lapply(seq_along(a), function(i) paste0(" ", names(a)[i], '="', a[[i]], '"'))),         
      '>'
    ),
    paste0('<div class="form-check', if (!as.checkbox) " form-switch", '">'),
    paste0('<label class="form-check-label" for="', id, '">', label, "</label>"),
    paste0(
      '<input auto-type="switch" type="checkbox" autocomplete="off"',
      ' class="auto-input form-check-input" role="switch" id="', id, '"',
      if (default_on) " checked", ">"
    ),
    "</div>",
    "</div>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") {
    caller$content <- c(caller$content, r)
  }
  r
}
