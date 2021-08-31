test_that("check_template passes", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  init_shiny("test_shiny", dir = dir)
  expect_true(check_template("shiny", "test_shiny", dir = dir)$exists)
})
