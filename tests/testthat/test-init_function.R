test_that("check_template passes", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  init_package("test_context", dir = dir)
  dir <- paste0(dir, "/test_context")
  init_function("test_function", dir = dir)
  expect_true(check_template("function", "test_function", dir = dir)$exists)
})
