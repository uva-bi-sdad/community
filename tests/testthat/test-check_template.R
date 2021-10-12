test_that("passes and failes as expected", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  expect_false(check_template("site", "test_site", dir = dir)$exists)
  init_site("test_site", dir = dir)
  expect_true(check_template("site", "test_site", dir = dir)$exists)
})
