#' Format a JavaScript Color Palette
#'
#' Make a specially-formatted color palette based on color codes.
#'
#' @param colors A vector of color names or HEX codes, or a matrix-like object with
#' colors in columns, and their RGB values in separate rows.
#' @param continuous Logical; if \code{TRUE}, \code{colors} are treated as points in a linear
#' gradient. One provided color will be from white to that color. Two provided colors will
#' be between those colors. Three or four provided colors will be between the first and
#' last color, with the central color (or average of the central colors) as the midpoint.
#' @param divergent Logical; if \code{TRUE}, marks continuous scales as divergent,
#' which will reverse the lower half of the scale.
#' @param name Name of the palette.
#' @param print Logical; if \code{FALSE}, will not print a version of the palette.
#' @examples
#' # a discrete palette
#' util_make_palette(c("red", "green", "blue"), FALSE)
#'
#' # a continuous palette
#' util_make_palette("red")
#'
#' # a divergent continuous palette
#' util_make_palette(c("red", "green"), divergent = TRUE)
#' @return An invisible list of the created palette.
#' @export

util_make_palette <- function(colors, continuous = length(colors) < 5, divergent = length(colors) > 2,
                              name = "custom", print = TRUE) {
  if (is.character(colors)) {
    cols <- col2rgb(colors)
  } else {
    cols <- colors
    if (is.null(dim(cols))) {
      cols <- if (is.list(cols)) {
        as.data.frame(cols)
      } else {
        matrix(cols, 3, dimnames = list(c("red", "green", "blue")))
      }
    }
  }
  if (nrow(cols) != 3) cli_abort("{.arg colors} could not be resolved to a matrix of RGB vectors")
  palette <- if (continuous) {
    if (length(colors) < 3) {
      if (length(colors) == 1) cols <- cbind(c(0, 0, 0), cols)
      cols <- cbind(cols[, 1], rowMeans(cols), cols[, 2])
    } else {
      if (ncol(cols) != 3) cols <- cbind(cols[, 1], rowMeans(cols[, 2:3]), cols[, 4])
    }
    cols <- t(cols)
    list(
      name = name,
      type = paste0("continuous", if (divergent) "-divergent"),
      colors = list(
        rbind(cols[3, ], cols[2, ] - cols[3, ]),
        cols[2, ],
        rbind(cols[1, ], cols[2, ] - cols[1, ])
      )
    )
  } else {
    list(
      name = name,
      type = "discrete",
      colors = unlist(lapply(
        as.data.frame(cols / 255), function(col) do.call(rgb, as.list(col))
      ), use.names = FALSE)
    )
  }
  if (print) cat(toJSON(palette, auto_unbox = TRUE, pretty = TRUE))
  invisible(palette)
}
