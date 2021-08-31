init_package <- function(name = "package", dir = ".") {
  dir.create(paste0(dir, "/", name, "/R"), FALSE, TRUE)
  dir.create(paste0(dir, "/", name, "/inst/specs"), FALSE, TRUE)
  dir.create(paste0(dir, "/", name, "/tests/testthat"), FALSE, TRUE)
}
