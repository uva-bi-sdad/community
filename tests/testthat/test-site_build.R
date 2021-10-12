test_that("template site builds", {
  dir <- paste0(tempdir(TRUE), "/test_site")
  dir.create(dir, FALSE)
  on.exit(unlink(dir, TRUE, TRUE))
  init_site("test_site", dir = dir)
  site_build(dir)
  expect_true(file.size(paste0(dir, "/docs/index.html")) > 0)
})
