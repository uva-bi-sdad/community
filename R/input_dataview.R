#' Add a unified data view to a website
#'
#' Collects specified inputs to create a filtered dataset from which outputs can pull.
#'
#' @param dataset Select which dataset to pull from; the name of an included dataset, or ID of a
#' selector of dataset names.
#' @param ids Select which IDs to include; a vector of IDs that appear in the specified dataset, or the ID of a
#' selector of IDs. If an IDs map is included in the site's datapackage, mapped components can be referred to here.
#' @param features Select IDs based on their features; a named list or vector, with names corresponding to
#' the names of features included in an \code{ids} field of the site's datapackage, and values corresponding to
#' a value or vector of values, or a selector of values.
#' @param id An ID of the data view, for association with output elements. Defaults to \code{'view'} appended
#' with a zero-index of views, based on the order in which they were specified
#' (e.g., \code{'view0'} for the first view).
#' @examples
#' \dontrun{
#' input_dataview(list())
#' }
#' @return The entered filter.
#' @export

input_dataview <- function(dataset = NULL, ids = NULL, features = NULL, id = NULL) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  r <- list()
  if (!is.null(dataset)) r$dataset <- dataset
  if (!is.null(ids)) r$ids <- ids
  if (!is.null(features)) r$features <- as.list(features)
  if (length(r) && building) {
    caller$dataviews[[if (is.null(id)) paste0("view", length(caller$dataviews)) else id]] <- r
  }
  r
}
