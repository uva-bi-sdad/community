#' Create a website
#'
#' Create a repository for a static website for data documentation and exploration.
#'
#' @param dir Directory in which to create the site's structure. Will be created if it does not exist.
#' @param title Title of the site.
#' @param with_data logical; if \code{FALSE}, a data sub-directory and package will not be created.
#' @param overwrite logical; if \code{TRUE}, will overwrite existing site files in \code{dir}.
#' @param quiet Logical; if \code{TRUE}, suppresses messages and does not navigate to the file when finished.
#' @examples
#' \dontrun{
#' # initialize site in the current working directory
#' init_site(".")
#' }
#' @return Path to the created site directory.
#' @export

init_site <- function(dir, title = "app", with_data = TRUE, overwrite = FALSE, quiet = !interactive()) {
  if (missing(dir)) cli_abort('{.arg dir} must be speficied (e.g., dir = ".")')
  check <- check_template("site", dir = dir)
  if (!quiet && check$exists && !overwrite) {
    cli_bullets(c(`!` = "site files already exist", i = "add {.code overwrite = TRUE} to overwrite them"))
  }
  dir <- normalizePath(paste0(dir, "/", check$spec$dir), "/", FALSE)
  dir.create(dir, FALSE, TRUE)
  paths <- paste0(dir, "/", c("README.md", "site.R", "package.json", "server.js", ".gitignore", "build.R", "project.Rproj"))
  if (!file.exists(paths[1])) {
    writeLines(paste(c(
      paste("#", title),
      "<template: Describe the site>",
      "\n## Run",
      "```R",
      '# remotes::install_github("uva-bi-sdad/community")',
      "library(community)",
      "\n# from the site directory:",
      "site_build()",
      "```",
      ""
    ), collapse = "\n"), paths[1])
  }
  if (!file.exists(paths[2])) {
    writeLines(paste(c(
      "library(community)",
      "# prepare and connect data in build.R:",
      paste0('# source("', dir, '/build.R")'),
      "",
      "# use `page_` functions to add parts of a page:",
      'page_navbar("Motor Trend Car Road Tests")',
      'page_text("Motor Trend Car Road Tests", tag = "h1", class = "text-center")',
      "",
      "# use `input_` functions to add input elements that affect outputs:",
      "page_menu(",
      '  input_select("Select a Variable", options = "variables", label = "variable", default = "wt"),',
      '  position = "top", default_open = TRUE',
      ")",
      "",
      "# use `output_` functions to data display components:",
      "page_section(",
      '  wraps = "col-sm",',
      '  output_plot("variable", "mpg", id = "main_plot"),',
      '  output_table("variable")',
      ")",
      "",
      "# add a tooltip",
      "output_info(",
      '  body = c("variables.short_name" = "value"), row_style = "stack",',
      '  subto = "main_plot", floating = TRUE',
      ")",
      "",
      "# render the site:",
      paste0('site_build("', dir, '", bundle_data = TRUE, open_after = TRUE)'),
      ""
    ), collapse = "\n"), paths[2])
  }
  if (!file.exists(paths[3])) {
    write_json(list(
      name = gsub("\\s+", "_", tolower(title)),
      version = "1.0.0",
      description = "",
      main = "server.js",
      directories = list(doc = "docs"),
      scripts = list(start = "node server.js"),
      dependencies = list(express = "latest"),
      author = "",
      license = "ISC"
    ), paths[3], pretty = TRUE, auto_unbox = TRUE)
  }
  if (!file.exists(paths[4])) {
    writeLines(paste(c(
      "'use strict'",
      "const express = require('express'), app = express()",
      "app.use(express.static('docs'))",
      "app.listen(3000, function () {",
      "  console.log('listening on port 3000')",
      "})",
      ""
    ), collapse = "\n"), paths[4])
  }
  if (!file.exists(paths[5])) {
    writeLines(paste(c(
      ".Rproj.user",
      ".Rhistory",
      ".Rdata",
      ".httr-oauth",
      ".DS_Store",
      "*.Rproj",
      "node_modules",
      "package-lock.json",
      "docs/dist",
      ""
    ), collapse = "\n"), paths[5])
  }
  if (!file.exists(paths[6])) {
    writeLines(paste(c(
      "# if there are datasets to add, include any preprocessing steps here",
      paste0('write.csv(cbind(name = rownames(mtcars), mtcars), "', dir, '/docs/data/mtcars.csv", row.names = FALSE)'),
      "",
      "# then add them to the site:",
      paste0(
        'data_add(\n  c(mtcars = "mtcars.csv"),\n  meta = list(\n    ids = list(variable = "name")\n  ),\n  dir = "',
        dir, '/docs/data",\n  refresh = TRUE\n)'
      ),
      "",
      "# now edit the site and build it from site.R"
    ), collapse = "\n"), paths[6])
  }
  if (!file.exists(paths[7]) && !any(grepl("\\.Rproj$", list.files(dir)))) writeLines("Version: 1.0\n", paths[7])
  dir.create(paste0(dir, "/docs"), FALSE)
  docs <- grep("/docs/", check$files, fixed = TRUE, value = TRUE)
  if (any(!file.exists(docs))) file.create(docs[!file.exists(docs)])
  if (with_data && !file.exists(paste0(dir, "/docs/data/datapackage.json"))) {
    dir.create(paste0(dir, "/docs/data"), FALSE)
    init_data(title, dir = dir, quiet = TRUE)
  }
  if (!quiet) {
    cli_bullets(c(
      v = "created a site skeleton for {title}:",
      "*" = paste0("{.path ", normalizePath(dir, "/", FALSE), "}")
    ))
    navigateToFile(paths[2])
  }
  invisible(dir)
}
