test_that("passes and failes as expected", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  expect_false(check_template("shiny", "test_shiny", dir = dir)$exists)
  init_shiny("test_shiny", dir = dir)
  expect_true(check_template("shiny", "test_shiny", dir = dir)$exists)
})
