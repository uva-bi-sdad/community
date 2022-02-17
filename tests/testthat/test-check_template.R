test_that("passes and failes as expected", {
  dir <- paste0(tempdir(TRUE), "/test_site")
  on.exit(unlink(dir, TRUE, TRUE))
  expect_false(check_template("site", "test_site", dir = dir)$exists)
  init_site(dir, "test_site")
  expect_true(check_template("site", "test_site", dir = dir)$exists)
})
