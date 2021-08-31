test_that("adds data when specified", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  path <- paste0(dir, "/mtcars.csv")
  write.csv(cbind(mtcars, group = sample(c("a", "b"), nrow(mtcars), TRUE)), path, row.names = FALSE)
  expect_equal(
    init_data("mtcars", data_paths = path, write = FALSE)$resources,
    add_data(path, write = FALSE)
  )
})
