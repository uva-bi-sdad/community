#' Add a map to a webpage
#'
#' Adds a Leaflet map to a webpage, based on specified or selected inputs.
#'
#' @param shapes A named list or vector with URLs of GeoJSON files.
#' @param color The name of a variable, or id of a variable selector, to be used to color polygons.
#' @param color_time The ID of a selector to specify which timepoint of \code{color} to use.
#' @param dataview The ID of an \code{\link{input_dataview}} component.
#' @param legend Logical; if \code{FALSE}, the legend will not be shown.
#' @param click The ID of an input to set to a clicked polygon's ID.
#' @param subto A vector of output IDs to receive hover events from.
#' @param options A list of configuration options, potentially extracted from a saved leaflet object (see
#' \href{https://leafletjs.com/reference-1.7.1.html#map-example}{Leaflet documentation}).
#' @param tiles A list or list of lists containing provider information (see
#' \href{https://leaflet-extras.github.io/leaflet-providers/preview/}{leaflet providers}; e.g.,
#' \code{list(}\code{url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}, \code{options = list(maxZoom = 19))}).
#' @param attribution A list with tile attribution information to be included in a credits section. Include in
#' \code{tile}'s \code{options} list to add to the map.
#' @examples
#' \dontrun{
#' output_map()
#' }
#' @return A character vector of the content to be added.
#' @export

output_map <- function(shapes = NULL, color = NULL, color_time = NULL, dataview = NULL, legend = TRUE, click = NULL,
                       subto = NULL,
                       options = list(), tiles = list(
                         url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                         options = list(maxZoom = 19)
                       ), attribution = list(
                         name = "OpenStreetMap",
                         url = "https://www.openstreetmap.org/copyright"
                       )) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  id <- 0
  if (legend) options$legend <- TRUE
  if (building) {
    caller$dependencies$leaflet_style <- list(
      type = "stylesheet",
      src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css",
      hash = "sha384-VzLXTJGPSyTLX6d96AxgkKvE/LRb7ECGyTxuwtpjHnVWVZs2gp5RDjeM/tgBnVdM"
    )
    caller$dependencies$leaflet <- list(
      type = "script",
      src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js",
      hash = "sha384-RFZC58YeKApoNsIbBxf4z6JJXmh+geBSgkCQXFyh+4tiFSJmJBt+2FbjxW7Ar16M"
    )
    id <- length(caller$maps)
    options$subto <- if (!is.null(subto) && length(subto) == 1) list(subto) else subto
    caller$maps[[paste0("map", id)]] <- list(shapes = as.list(shapes), options = options, tiles = tiles)
  }
  r <- paste(c(
    '<div class="auto-output leaflet"',
    if (!is.null(dataview)) paste0('data-view="', dataview, '"'),
    if (!is.null(click)) paste0('click="', click, '"'),
    if (!is.null(color)) paste0('color="', color, '"'),
    if (!is.null(color_time)) paste0('color-time="', color_time, '"'),
    paste0('id="map', id, '"'),
    'auto-type="map"></div>'
  ), collapse = " ")
  if (building) {
    caller$content <- c(caller$content, r)
    caller$credits$leaflet <- list(
      name = "Leaflet",
      url = "https://leafletjs.com",
      version = "1.7.1",
      description = "A JS library for interactive maps"
    )
    if (!missing(attribution) || missing(tiles)) {
      if (!is.null(attribution$name)) {
        caller$credits[[attribution$name]] <- attribution
      } else if (!is.null(attribution[[1]]$name)) {
        for (a in attribution) caller$credits[[a$name]] <- a
      }
    }
  }
  r
}
