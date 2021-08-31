test_that("adds to an existing package", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  path <- paste0(dir, "/mtcars.csv")
  write.csv(cbind(mtcars, group = sample(c("a", "b"), nrow(mtcars), TRUE)), path, row.names = FALSE)
  init_data("mtcars", "Motor Trend Car Road Tests", dir = dir)
  metadata <- add_data(path, paste0(dir, "/datapackage.json"))
  expect_equal(metadata, read_json(paste0(dir, "/datapackage.json"))$resources)
})
