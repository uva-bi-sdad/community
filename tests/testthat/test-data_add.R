test_that("adds to an existing package", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  path <- paste0(dir, "/mtcars.csv")
  write.csv(cbind(mtcars, group = sample(c("a", "b"), nrow(mtcars), TRUE)), path, row.names = FALSE)
  init_data("mtcars", "Motor Trend Car Road Tests", dir = dir, quiet = TRUE)
  metadata <- data_add(path, package_path = paste0(dir, "/datapackage.json"))
  read <- jsonify::from_json(paste0(dir, "/datapackage.json"), simplify = FALSE)$resources
  read[[1]]$schema$fields <- lapply(read[[1]]$schema$fields, function(f) {
    f$time_range <- as.numeric(f$time_range)
    f
  })
  expect_equal(metadata, read)
})
