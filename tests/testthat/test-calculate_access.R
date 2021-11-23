library(Matrix)

test_that("example results align with manual", {
  demand <- c(5, 10, 50)
  supply <- c(50, 100)
  cost <- Matrix(c(5, 35, 40, 55, 15, 25), ncol = 2, sparse = TRUE)

  weight <- cost < 20
  access <- as.numeric(weight %*% (supply / crossprod(weight, demand)))
  expect_equal(calculate_access(demand, supply, cost, 20), access)

  # enhanced 2-step floating catchment area
  weight <- (cost <= 60) * .22
  weight[cost <= 40] <- .68
  weight[cost <= 20] <- 1
  access <- as.numeric(weight %*% (supply / crossprod(weight, demand)))
  expect_equal(calculate_access(demand, supply, cost, list(c(60, .22), c(40, .68), c(20, 1))), access)

  # 3-step floating catchment area
  weight <- weight * weight / rowSums(weight)
  access <- as.numeric(weight %*% (supply / crossprod(weight, demand)))
  expect_equal(calculate_access(demand, supply, cost, list(c(60, .22), c(40, .68), c(20, 1)), TRUE), access)
})
