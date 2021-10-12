#' Add a range slider to a website
#'
#' Adds an input to select within the entered range.
#'
#' @param label Label of the input for the user.
#' @param range A numeric vector with a minimum and maximum, or the name of a variable to calculate a range from.
#' @param stepsize How much moving the handle adjusts the selected value.
#' @param default Starting value of the slider handle.
#' @param id Unique id of the element to be created.
#' @param variable The name of a variable to calculate a range from (overwrites \code{range}).
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

input_slider <- function(label, range = c(0, 1), stepsize = 1, default = NULL, id = label,
                         variable = NULL, dataset = NULL, depends = NULL) {
  if (is.character(range) || !is.null(variable)) {
    if (is.null(variable)) variable <- range
    range <- c(0, 1)
  }
  if (is.null(default)) default <- range[2]
  id <- gsub("\\s", "", id)
  r <- c(
    '<div class="wrapper slider-wrapper">',
    paste0('<label class="form-label" for="', id, '">', label, "</label>"),
    paste0(
      '<input type="range" class="auto-input form-range" auto-type="slider" id="', id, '" default=', default,
      " step=", stepsize, " min=", range[1], " max=", range[2],
      if (!is.null(depends)) {
        paste0(' depends="', depends, '"')
      } else
      if (!is.null(dataset)) paste0('dataset="', dataset, '" '),
      if (!is.null(variable)) paste0(' variable="', variable, '"'),
      "></input>"
    ),
    "</div>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") {
    caller$content <- c(caller$content, r)
  }
  r
}
