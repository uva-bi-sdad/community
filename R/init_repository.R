
#' Create a Data Repository
#'
#' Create a repository for a dataset, which may include data documentation and/or a data site.
#'
#' @param dir Directory in which to create the repository's structure. Will be created if it does not exist.
#' @param init_data Logical; if \code{FALSE}, will not run \code{\link{init_data}} on the repository.
#' @param init_site Logical; if \code{FALSE}, will not run \code{\link{init_site}} on the repository.
#' @param init_git Logical; if \code{FALSE}, will not run \code{git init} on the repository.
#' @param overwrite Logical; if \code{TRUE}, will overwrite existing site files in \code{dir}.
#' @param quiet Logical; if \code{TRUE}, suppresses messages.
#' @examples
#' \dontrun{
#' # initialize repository in the current working directory
#' init_repository(".")
#' }
#' @return Path to the created repository directory.
#' @export

init_repository <- function(dir, init_data = TRUE, init_site = TRUE, init_git = TRUE,
                            overwrite = FALSE, quiet = !interactive()) {
  if (missing(dir)) cli_abort('{.arg dir} must be speficied (e.g., dir = ".")')
  check <- check_template("repository", dir = dir)
  if (!quiet && check$exists && !overwrite) {
    cli_bullets(c(`!` = "repository files already exist", i = "add {.code overwrite = TRUE} to overwrite them"))
  }
  dir <- normalizePath(paste0(dir, "/", check$spec$dir), "/", FALSE)
  dir.create(dir, FALSE, TRUE)
  dir.create(paste0(dir, "/docs"), FALSE)
  dir.create(paste0(dir, "/data/original"), FALSE, TRUE)
  dir.create(paste0(dir, "/data/working"), FALSE)
  dir.create(paste0(dir, "/data/distribution"), FALSE)
  dir.create(paste0(dir, "/src"), FALSE)
  paths <- paste0(dir, "/", c("README.md", ".gitignore", "src/retrieve.R", "data/distribution/measure_info.json", "build.R", "site.R"))
  if (!file.exists(paths[1])) {
    writeLines(c(
      "<template: Describe the repository>",
      "\n# Structure",
      "This is a community data repository, created with the `community::init_repository()` function.",
      "1. `src/retrieve.R` should download and prepare data from a public source, and output files to `data/distribution`.",
      "2. `data/distribution/measure_info.json` should contain metadata for each of the measures in the distribution data file(s).",
      paste(
        "3. `build.R` will convert the distribution data to site-ready versions,",
        "and `site.R` specifies the interface of the repository-specific data site."
      )
    ), paths[1])
  }
  if (!file.exists(paths[2])) {
    writeLines(c(
      ".Rproj.user",
      ".Rhistory",
      ".Rdata",
      ".httr-oauth",
      ".DS_Store",
      ".netlify",
      "*.Rproj",
      "node_modules",
      "package-lock.json",
      "docs/dist",
      "data/original"
    ), paths[2])
  }
  if (!file.exists(paths[3])) {
    writeLines(c(
      "# <template: use this file to set up the creation and/or preparation of the data>"
    ), paths[3])
  }
  if (!file.exists(paths[4])) writeLines("{}", paths[4])
  if (init_site) {
    if (!file.exists(paste0(dir, "/build.R"))) {
      file.copy(
        paste0(path.package("community"), "/templates/repository_site/build.R"), paste0(dir, "/build.R")
      )
    }
    if (!file.exists(paste0(dir, "/site.R"))) {
      file.copy(
        paste0(path.package("community"), "/templates/repository_site/site.R"), paste0(dir, "/site.R")
      )
    }
    init_site(dir, with_data = init_data, quiet = TRUE)
  } else if (init_data) {
    init_data("data", quiet = TRUE)
  }
  if (Sys.which("git") != "") {
    wd <- getwd()
    on.exit(setwd(wd))
    setwd(dir)
    system2("git", "init")
  }
  invisible(dir)
}
