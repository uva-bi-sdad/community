#' Add a button to a website
#'
#' Adds a button to reset an input or trigger a predefined function (including data export) to a website.
#'
#' @param label Text in the button for the user.
#' @param target The ID of an input element to reset, a vector with IDs of input elements as names and values to set
#' those inputs to as values, or the name of a function to trigger (e.g., \code{c(input_a = 1)}). Available function
#' are \code{refresh} (to force a reprocessing of the current input state), \code{reset_selection} (to reset all input
#' elements that are not settings), \code{reset_storage} (to clear local storage, reset all settings, and reload),
#' and \code{export} (to download data). This can also be a URL (including protocol) for a button-like link.
#' @param id Unique ID of the element to be created.
#' @param dataview Name of a data view to get selection and filter options from for export.
#' @param query A list of query parameters, if \code{target} is \code{"export"}.
#' @param class Additional class names to add to the element.
#' @param ... Additional attributes to set on the element.
#' @param note Text to display as a tooltip for the button.
#' @seealso For buttons to select between a set of options, use \code{\link{input_buttongroup}}.
#' @examples
#' \dontrun{
#' input_button("Reset")
#' }
#' @return A character vector of the contents to be added.
#' @export

input_button <- function(label, target = "reset_selection", id = label, dataview = NULL,
                         query = list(), class = "", ..., note = NULL) {
  id <- gsub("\\s", "", id)
  a <- list(...)
  if (missing(target) && !(missing(dataview) || missing(query))) {
    target <- "export"
  }
  r <- c(
    '<div class="wrapper button-wrapper">',
    if (is.character(target) && length(target) == 1 && grepl("://", target, fixed = TRUE)) {
      paste0(
        '<a role="button" class="btn', if (class != "") paste("", class),
        '" id="', id, '" target="_blank" rel="noreferrer" href="', target, '"',
        if (length(a)) unlist(lapply(seq_along(a), function(i) paste0(" ", names(a)[i], '="', a[[i]], '"'))),
        if (!is.null(note)) paste0(' aria-description="', note, '"'),
        ">", label, "</a>"
      )
    } else {
      paste0(
        '<button type="button" auto-type="button" class="auto-input btn', if (class != "") paste("", class),
        '" id="', id, '"', if (length(target) == 1 && !is.list(target) && is.null(names(target))) paste0(' target="', target, '"'),
        if (length(a)) unlist(lapply(seq_along(a), function(i) paste0(" ", names(a)[i], '="', a[[i]], '"'))),
        if (!is.null(note)) paste0(' aria-description="', note, '"'),
        ">", label, "</button>"
      )
    },
    "</div>"
  )
  caller <- parent.frame()
  if (!is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts") {
    if (target == "export") {
      caller$button[[id]] <- list(
        effects = target,
        dataview = dataview,
        query = query
      )
    } else if (!is.null(names(target))) caller$button[[id]] <- list(effects = target)
    caller$content <- c(caller$content, r)
  }
  r
}
