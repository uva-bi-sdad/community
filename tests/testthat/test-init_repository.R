test_that("check_template passes", {
  dir <- tempdir(TRUE)
  on.exit(unlink(dir, TRUE, TRUE))
  init_repository(dir, "set_a")
  expect_true(check_template("repository", "test_repository", dir = dir)$exists)
  expect_true(all(file.exists(paste0(dir, c("/code/", "/data/"), "set_a"))))
  init_repository(dir, "set_b")
  expect_true(all(file.exists(paste0(dir, c("/code/", "/data/"), "set_b"))))
})
