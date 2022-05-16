test_that("check_template passes", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  init_repository(dir)
  expect_true(check_template("repository", "test_repository", dir = dir)$exists)
})
