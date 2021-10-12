test_that("check_template passes", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  init_site("test_site", dir = dir)
  expect_true(check_template("site", "test_site", dir = dir)$exists)
})
