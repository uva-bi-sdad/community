#' Add a plot to a webpage
#'
#' Adds a Plotly plot to a webpage, based on specified or selected .
#'
#' @param x Default title at the top of the element.
#' @param y Default message below the title, to be replaced by the information table.
#' @param color The name of a variable, or ID of a variable selector to use to color lines.
#' @param color_time The ID of a selector to specify which timepoint of \code{color} to use.
#' @param dataview The ID of an \code{\link{input_dataview}} component.
#' @param click The ID of an input to set to a clicked line's ID.
#' @param subto A vector of output IDs to receive hover events from.
#' @param options A list of configuration options, with named entries for any of \code{data}, \code{layout},
#' or \code{options}, potentially extracted from a saved plotly object (see
#' \href{https://plotly.com/javascript/confguration-options}{Plotly documentation}).
#' @examples
#' \dontrun{
#' output_info("Initial State", "Make a selection for more information.")
#' }
#' @return A character vector of the content to be added.
#' @export

output_plot <- function(x = NULL, y = NULL, color = NULL, color_time = NULL, dataview = NULL,
                        click = NULL, subto = NULL, options = NULL) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  id <- 0
  entries <- c("layout", "config", "data")
  if (is.character(options)) options <- fromJSON(options)
  if ("x" %in% names(options)) options <- options$x
  options <- options[entries[entries %in% names(options)]]
  options$subto <- if (!is.null(subto) && length(subto) == 1) list(subto) else subto
  r <- paste(c(
    '<div class="auto-output plotly"',
    if (!is.null(dataview)) paste0('data-view="', dataview, '"'),
    if (!is.null(click)) paste0('click="', click, '"'),
    if (!is.null(x)) paste0('x="', x, '"'),
    if (!is.null(y)) paste0('y="', y, '"'),
    if (!is.null(color)) paste0('color="', color, '"'),
    if (!is.null(color_time)) paste0('color-time="', color_time, '"'),
    if (!is.null(color_time)) paste0('color-time="', color_time, '"'),
    paste0('id="plot', id, '"'),
    'auto-type="plot"></div>'
  ), collapse = " ")
  if (building) {
    caller$dependencies$plotly <- list(
      type = "script",
      src = "https://cdn.plot.ly/plotly-2.4.2.min.js",
      hash = "sha384-X9COQf511UOEwK4K4fkWIg2ySl5SMo0Rs9PDwMXSwMKKbBgvpMLpmGuD3Z6VM/uR"
    )
    id <- length(caller$plots)
    caller$plots[[paste0("plot", id)]] <- options
    caller$content <- c(caller$content, r)
  }
  r
}
