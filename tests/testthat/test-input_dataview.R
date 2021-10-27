test_that("reformats properly", {
  expect_equal(
    list(
      palette = "divergent",
      time_agg = "last",
      time_filters = list(),
      dataset = "dataset",
      ids = "ids",
      features = list("features")
    ),
    input_dataview(dataset = "dataset", ids = "ids", features = "features")
  )
})
