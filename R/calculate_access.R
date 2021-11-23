#' Calculate spacial access scores.
#'
#' Calculate variants of floating catchment areas -- measures of access as potentially weighted consumer to provider
#' ratios.
#'
#' @param consumers Number of consumers (demand); either a vector with consumer amounts (such as population counts),
#' or a matrix-like object with a column of IDs (located by \code{consumers_id}) and a column of amounts (located by
#' \code{consumers_value}).
#' @param providers Number of providers (supply); either a vector with provider amounts (such as number of doctors),
#' or a matrix-like object with a column of IDs (located by \code{providers_id}) and a column of amounts (located by
#' \code{providers_value}).
#' @param cost Cost associated with each pair of \code{consumers} and \code{providers}, such as distance or travel
#' time.
#' @param buffers Means of associating \code{consumers} to \code{providers}. The simplest is a single number
#' representing a maximum distance from each provider, effectively selecting only consumers within
#' a catchment area (2-step floating catchment area). An enhancement of this is a list of vectors with two values
#' each: the first is a distance, and the second a weight to associate with that distance (e.g.,
#' \code{list(c(10, 1), c(20, .5))}, which will give consumers within a \code{cost} of 10 full weight, and those within
#' a \code{cost} of 20 half weight; enhanced 2-step floating catchment area).
#' @param selection_weight Logical; if \code{TRUE}, will adjust the weight of \code{buffers} by a value associated
#' with each consumer (3-step floating catchment area).
#' @param consumers_id,consumers_value,providers_id,providers_value Column names in \code{consumers} and/or
#' \code{providers} to extract IDs and values.
#' @examples
#' pop <- c(5, 10, 50)
#' doc <- c(50, 100)
#' travel_time <- matrix(c(5, 50, 25, 70, 40, 30), ncol = 2)
#'
#' # 2-step floating catchment area
#' calculate_access(pop, doc, travel_time, 30)
#'
#' # enhanced 2-step floating catchment area
#' calculate_access(pop, doc, travel_time, list(c(60, .22), c(40, .68), c(20, 1)))
#'
#' # 3-step floating catchment area
#' calculate_access(pop, doc, travel_time, list(c(60, .22), c(40, .68), c(20, 1)), TRUE)
#' @return A vector with an access score for each \code{consumer}.
#' @references
#' Lou, W. & Qi, Y. (2009). An enhanced two-step floating catchment area (E2SFCA) method for measuring spatial
#' accessibility to primary care physicians. \emph{Health & Place, 15}, 1100-1107.
#' doi: \href{https://doi.org/10.1016/j.healthplace.2009.06.002}{10.1016/j.healthplace.2009.06.002}
#'
#' Radke, J. & Mu, L. (2000). Spatial decompositions, modeling and mapping service regions to predict access
#' to social programs. \emph{Geographic Information Sciences, 6}, 105-112.
#' doi: \href{https://doi.org/10.1080/10824000009480538}{10.1080/10824000009480538}
#'
#' Wan, N., Zou, B., & Sternberg, T. (2012). A three-step floating catchment area method for analyzing spatial
#' access to health services. \emph{International Journal of Geographical Information Science, 26}, 1073-1089.
#' doi: \href{https://doi.org/10.1080/13658816.2011.624987}{10.1080/13658816.2011.624987}
#' @export

calculate_access <- function(consumers, providers, cost = NULL, buffers = NULL, selection_weight = FALSE,
                             consumers_id = "geoid", consumers_value = "count", providers_id = "geoid", providers_value = "count") {
  pass <- TRUE
  if (!is.null(cost)) {
    if (is.numeric(buffers)) {
      # single buffer value means a uniformly weighted catchment area (2-step)
      weight <- cost > 0 & cost < buffers
    } else if (is.list(buffers)) {
      # list of steps for roughly graded weightings (enhanced 2-step)
      buffers <- buffers[order(-vapply(buffers, "[[", 1, 1))]
      weight <- (cost <= buffers[[1]][1]) * buffers[[1]][2]
      for (s in buffers[-1]) weight[cost <= s[1]] <- s[2]
      weight[cost <= 0] <- 0
    } else {
      weight <- cost > 0
    }
  }

  # getting provider and consumer value vectors
  pv <- if (is.null(dim(providers))) {
    providers
  } else if (providers_value %in% colnames(providers)) {
    providers[, providers_value, drop = TRUE]
  } else {
    providers[, which(vapply(seq_len(ncol(providers)), function(i) {
      is.numeric(providers[, i])
    }, TRUE))[1], drop = TRUE]
  }
  if (!length(pv)) cli_abort("failed to recognize values in {.arg providers}")
  cv <- if (is.null(dim(consumers))) {
    consumers
  } else if (consumers_value %in% colnames(consumers)) {
    consumers[, consumers_value, drop = TRUE]
  } else {
    consumers[, which(vapply(seq_len(ncol(consumers)), function(i) {
      is.numeric(consumers[, i])
    }, TRUE))[1], drop = TRUE]
  }
  if (!length(cv)) cli_abort("failed to recognize values in {.arg consumers}")

  # getting provider and consumer ids
  pid <- if (is.null(dim(providers))) {
    if (!is.null(names(providers))) names(providers) else seq_along(pv)
  } else
  if (providers_id %in% colnames(providers)) providers[, providers_id, drop = TRUE] else seq_along(pv)
  if (!length(pid)) cli_abort("failed to recognize IDs in {.arg providers}")
  cid <- if (is.null(dim(consumers))) {
    if (!is.null(names(consumers))) names(consumers) else seq_along(cv)
  } else
  if (consumers_id %in% colnames(consumers)) consumers[, consumers_id, drop = TRUE] else seq_along(cv)
  if (!length(cid)) cli_abort("failed to recognize IDs in {.arg consumers}")

  if (is.null(cost)) {
    cost <- weight <- matrix(1, length(cv), length(pv), dimnames = list(cid, pid))
  }

  if (selection_weight) {
    # adjust weights by selection probability (3-step)
    wr <- rowSums(weight)

    if (nrow(weight) != length(cv)) {
      weight <- if (!is.null(rownames(weight))) {
        weight[as.character(pid), as.character(cid)]
      } else {
        weight[seq_along(pid), seq_along(cid)]
      }
      wr <- wr[rownames(weight)]
    }

    wr[wr == 0] <- 1
    weight <- weight * sweep(weight, 1, wr, "/")
  } else if (nrow(weight) != length(cv)) {
    weight <- if (!is.null(rownames(weight))) {
      weight[as.character(pid), as.character(cid)]
    } else {
      weight[seq_along(pid), seq_along(cid)]
    }
  }

  wd <- crossprod(weight, cv)
  wd[wd == 0] <- 1
  as.numeric(weight %*% (pv / wd))
}
