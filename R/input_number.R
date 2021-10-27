#' Add a number input to a website
#'
#' Adds an direct number input element to a website.
#'
#' @param label Label of the input for the user.
#' @param id Unique ID of the element to be created.
#' @param ... Other attributes to add to the input.
#' @param default Default value of the input, the ID of an input to use as the default, or \code{"min"} or \code{"max"}
#' to default to the current minimum or maximum value.
#' @param min The smallest allowed value.
#' @param max The largest allowed value.
#' @param step Amount to increase or decrease the value by when changed with arrows.
#' @param type Name of the input's type -- other number-based types like \code{date} might make sense.
#' @param class Class names to add to the input's list.
#' @param dataview ID of a \code{\link{input_dataview}}, to use as a source of variables.
#' @examples
#' \dontrun{
#' input_text("entered_text", "Enter Text:")
#' }
#' @return A character vector of the contents to be added.
#' @export

input_number <- function(label, id = label, ..., default = NULL, min = NULL, max = NULL, step = NULL,
                         type = "number", class = NULL, dataview = NULL) {
  id <- gsub("\\s", "", id)
  r <- c(
    '<div class="wrapper text-wrapper">',
    paste0('<label for="', id, '">', label, "</label>"),
    paste0(c(
      '<input type="', type, '"',
      ' id="', id, '"',
      if (!is.null(default)) paste0(' default="', default, '"'),
      if (!is.null(min)) paste0(' min="', min, '"'),
      if (!is.null(max)) paste0(' max="', max, '"'),
      if (!is.null(step)) paste0(' step="', step, '"'),
      if (!is.null(dataview)) paste0(' data-view="', dataview, '"'),
      unlist(list(...)),
      ' class="form-control auto-input', if (!is.null(class)) paste("", class), '" auto-type="number">'
    ), collapse = ""),
    "</div>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") {
    caller$content <- c(caller$content, r)
  }
  r
}
