#' Initialize a Data Commons
#'
#' Initialize a project to keep track of separate dataset repositories and distributions.
#'
#' @param dir Path to the desired data commons directory.
#' @param name Name of the data commons.
#' @param default_user GitHub username to prepend to repository names if needed.
#' @param repos A vector of repository names to add to \code{repo_list.txt}.
#' @param overwrite logical; if \code{TRUE}, will overwrite existing datacommons files in \code{dir}.
#' @param verbose Logical; if \code{FALSE}, suppresses messages.
#' @examples
#' \dontrun{
#' init_datacommons("../datacommons")
#' }
#' @return Path to the datacommons directory.
#' @export

init_datacommons <- function(dir, name = "data commons", repos = NULL, default_user = "", overwrite = FALSE, verbose = interactive()) {
  if (missing(dir)) cli_abort('{.arg dir} must be speficied (e.g., dir = ".")')
  check <- check_template("datacommons", dir = dir)
  if (overwrite) unlink(check$files, TRUE)
  dir <- normalizePath(paste0(dir, "/", check$spec$dir), "/", FALSE)
  dir.create(paste0(dir, "/repos"), FALSE, TRUE)
  dir.create(paste0(dir, "/cache"), FALSE)
  dir.create(paste0(dir, "/views"), FALSE)
  paths <- paste0(dir, "/", c("commons.json", "README.md", ".gitignore", "project.Rproj"))
  if (!file.exists(paths[1])) {
    write_json(list(
      name = name, default_user = default_user, repositories = repos
    ), paths[1], pretty = TRUE, auto_unbox = TRUE)
  }
  if (!file.exists(paths[2])) {
    writeLines(c(
      paste("#", name),
      "",
      "Consists of the repositories listed in (commons.json)[commons.json].",
      "",
      "This will refresh and check them:",
      "```R",
      '# remotes::install_github("uva-bi-sdad/community")',
      "library(community)",
      "",
      "# clone and/or pull repositories:",
      paste0('datacommons_refresh("', dir, '")'),
      "```",
      ""
    ), paths[2])
  }
  if (!file.exists(paths[3])) {
    writeLines(c(
      ".Rproj.user",
      ".Rhistory",
      ".Rdata",
      ".httr-oauth",
      ".DS_Store",
      "*.Rproj",
      "node_modules",
      "package-lock.json",
      "repos",
      ""
    ), paths[3])
  }
  if (!file.exists(paths[4]) && !any(grepl("\\.Rproj$", list.files(dir)))) {
    writeLines("Version: 1.0\n", paths[4])
  }
  if (verbose) {
    cli_bullets(c(
      v = "created {name}:",
      "*" = paste0("{.path ", normalizePath(dir, "/", FALSE), "}"),
      i = if (!length(repos)) {
        paste0(
          "add repository names to {.file repo_list.txt}, then use",
          '{.code datacommons_refresh("', dir, '")} to clone them'
        )
      }
    ))
  }
  if (length(repos)) datacommons_refresh(dir, verbose = verbose)
  invisible(dir)
}
