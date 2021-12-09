test_that("check_template passes", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  init_site(dir, "test_site")
  expect_true(check_template("site", "test_site", dir = dir)$exists)
})
