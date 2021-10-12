test_that("reformats properly", {
  expect_equal(
    list(dataset = "dataset", ids = "ids", features = list("features")),
    input_dataview("dataset", "ids", "features")
  )
})
