#' Add a range slider to a website
#'
#' Adds an input to select within the entered range.
#'
#' @param label Label of the input for the user.
#' @param id Unique id of the element to be created.
#' @param min The smallest value in the range.
#' @param max The largest value in the range.
#' @param step How much moving the handle adjusts the selected value.
#' @param default Starting value of the slider handle.
#' @param dataset The name of an included dataset, where \code{variable} should be looked for; only applies when
#' there are multiple datasets with the same variable name.
#' @param depends The id of another input on which the options depend; this will take president over \code{dataset}
#' and \code{variable}, depending on this type of input \code{depends} points to.
#' @examples
#' \dontrun{
#' input_slider()
#' }
#' @return A character vector of the contents to be added.
#' @export

input_slider <- function(label, id = label, min = 0, max = 1, step = 1, default = max,
                         dataset = NULL, depends = NULL) {
  id <- gsub("\\s", "", id)
  r <- c(
    '<div class="wrapper slider-wrapper">',
    paste0('<label class="form-label" for="', id, '">', label, "</label>"),
    paste0(
      '<input role="slider" type="range" class="auto-input form-range" auto-type="number" id="', id, '" default=', default,
      " step=", step, " min=", min, " max=", max,
      if (!is.null(depends)) {
        paste0(' depends="', depends, '"')
      } else
      if (!is.null(dataset)) paste0('dataset="', dataset, '" '),
      ">"
    ),
    paste0('<div class="slider-display"><span>', default, "</span></div>"),
    "</div>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") {
    caller$content <- c(caller$content, r)
  }
  r
}
