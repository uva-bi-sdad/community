test_that("template site builds", {
  dir <- paste0(tempdir(), "/test_site")
  dir.create(dir, FALSE)
  on.exit(unlink(dir, TRUE, TRUE))
  init_site(dir, template = "mtcars")
  source(paste0(dir, "/build.R"), chdir = TRUE)
  expect_true(file.size(paste0(dir, "/docs/index.html")) > 0)
})
