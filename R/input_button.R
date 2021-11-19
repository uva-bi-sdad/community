#' Add a button to a website
#'
#' Adds a button to reset an input or trigger a predefined function to a website.
#'
#' @param label Text in the button for the user.
#' @param target The ID of an input element to reset, or the name of a function to trigger. Available function are
#' \code{refresh} (to force a reprocessing of the current input state), \code{reset_selection} (to reset all input
#' elements that are not settings), and \code{reset_storage} (to clear local storage, reset all settings, and reload).
#' @param id Unique ID of the element to be created.
#' @param class Additional class names to add to the element.
#' @param ... Additional attributes to set on the element.
#' @seealso For buttons to select between a set of options, use \code{\link{input_buttongroup}}.
#' @examples
#' \dontrun{
#' input_button("Reset")
#' }
#' @return A character vector of the contents to be added.
#' @export

input_button <- function(label, target = "reset_selection", id = label, class = "", ...) {
  id <- gsub("\\s", "", id)
  a <- list(...)
  r <- c(
    '<div class="wrapper button-wrapper">',
    paste0(
      '<button type="button" auto-type="button" class="auto-input btn', if (class != "") paste("", class),
      '" id="', id, '"', if (!is.null(target)) paste0(' target="', target, '"'),
      if (length(a)) unlist(lapply(seq_along(a), function(i) paste0(" ", names(a)[i], '="', a[[i]], '"'))),
      ">", label, "</button>"
    ),
    "</div>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") {
    caller$content <- c(caller$content, r)
  }
  r
}
