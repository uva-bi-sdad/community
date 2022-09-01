test_that("check_template passes", {
  dir <- paste0(tempdir(TRUE), "/test_repository")
  on.exit(unlink(dir, TRUE, TRUE))
  init_repository(dir, "set_a")
  expect_true(check_template("repository", "test_repository", dir = dir)$exists)
  expect_true(all(file.exists(paste0(dir, "/set_a/", c("code", "data")))))
  init_repository(dir, "set_b")
  expect_true(all(file.exists(paste0(dir, "/set_b/", c("code", "data")))))
})
