#' Add a select input to a website
#'
#' Adds an input to select from the entered options.
#'
#' @param label Label of the input for the user.
#' @param options A vector of options, the name of a variable from which to pull levels, or either \code{"datasets"}
#' or \code{"variables"} to select names of datasets or variables.
#' @param default Which of the options to default to; either its index or value.
#' @param display A display version of the options.
#' @param id Unique ID of the element to be created.
#' @param variable The name of a variable from which to get levels (overwritten by \code{depends}).
#' @param dataset The name of an included dataset, where \code{variable} should be looked for; only applies when
#' there are multiple datasets with the same variable name.
#' @param depends The ID of another input on which the options depend; this will take president over \code{dataset}
#' and \code{variable}, depending on this type of input \code{depends} points to.
#' @param dataview The ID of an \code{\link{input_dataview}}, used to filter the set of options, and potentially
#' specify dataset if none is specified here.
#' @param reset_button If specified, adds a button after the select element that will revert the selection
#' to its default; either \code{TRUE}, or text for the reset button's label.
#' @examples
#' \dontrun{
#' input_select()
#' }
#' @return A character vector of the contents to be added.
#' @export

input_select <- function(label, options, default = -1, display = options, id = label,
                         variable = NULL, dataset = NULL, depends = NULL, dataview = NULL, reset_button = FALSE) {
  id <- gsub("\\s", "", id)
  r <- c(
    '<div class="wrapper select-wrapper">',
    paste0('<label for="', id, '">', label, "</label>"),
    '<div class="input-group mb-3">',
    paste0(
      '<select class="auto-input form-select" auto-type="select" id="', id, '" default="', default, '" ',
      if (is.character(options) && length(options) == 1) paste0('auto-options="', options, '"'),
      if (!is.null(default)) paste0(' default="', default, '"'),
      if (!is.null(dataview)) paste0(' data-view="', dataview, '"'),
      if (!is.null(depends)) paste0(' depends="', depends, '"'),
      if (!is.null(dataset)) paste0(' dataset="', dataset, '"'),
      if (!is.null(variable)) paste0(' variable="', variable, '"'),
      ">"
    ),
    if (length(options) > 1) {
      unlist(lapply(seq_along(options), function(i) {
        paste0('<option value="', options[i], '"', if (i == default) "selected", ">", display[i], "</option>")
      }), use.names = FALSE)
    },
    "</select>",
    if (!missing(reset_button)) {
      paste0(
        '<button type="button" class="btn btn-primary select-reset">',
        if (is.character(reset_button)) reset_button else "Reset",
        "</button>"
      )
    },
    "</div>",
    "</div>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") {
    caller$content <- c(caller$content, r)
  }
  r
}
