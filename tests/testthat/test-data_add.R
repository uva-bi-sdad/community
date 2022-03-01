test_that("adds to an existing package", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  path <- paste0(dir, "/mtcars.csv")
  write.csv(cbind(mtcars, group = sample(c("a", "b"), nrow(mtcars), TRUE)), path, row.names = FALSE)
  init_data("mtcars", "Motor Trend Car Road Tests", dir = dir, quiet = TRUE)
  metadata <- data_add(path, package_path = paste0(dir, "/datapackage.json"))
  read <- read_json(paste0(dir, "/datapackage.json"))$resources
  read[[1]]$schema$fields <- lapply(read[[1]]$schema$fields, function(f) {
    f$time_range <- as.numeric(f$time_range)
    f
  })
  metadata[[1]]$time <- Filter(length, list(a = NULL))
  expect_equal(metadata, read)
})
