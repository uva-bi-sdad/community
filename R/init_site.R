#' Create a website
#'
#' Create a repository for a static website for data documentation and exploration.
#'
#' @param dir Directory in which to create the site's structure. Will be created if it does not exist.
#' @param title Title of the site.
#' @param with_data Logical; if \code{FALSE}, a data sub-directory and package will not be created.
#' @param node_project Logical; if \code{TRUE}, includes files used to run the site from a Node.js server.
#' @param include_api Logical; if \code{TRUE}, will make a \code{netlify.toml} config file to specify the
#' function directory for the API function, if included by \code{\link{site_build}}.
#' @param overwrite Logical; if \code{TRUE}, will overwrite existing site files in \code{dir}.
#' @param quiet Logical; if \code{TRUE}, suppresses messages and does not navigate to the file when finished.
#' @examples
#' \dontrun{
#' # initialize site in the current working directory
#' init_site(".")
#' }
#' @return Path to the created site directory.
#' @export

init_site <- function(dir, title = "app", with_data = TRUE, node_project = FALSE, include_api = FALSE,
                      overwrite = FALSE, quiet = !interactive()) {
  if (missing(dir)) cli_abort('{.arg dir} must be speficied (e.g., dir = ".")')
  check <- check_template("site", dir = dir)
  if (!quiet && check$exists && !overwrite) {
    cli_bullets(c(`!` = "site files already exist", i = "add {.code overwrite = TRUE} to overwrite them"))
  }
  dir <- normalizePath(paste0(dir, "/", check$spec$dir), "/", FALSE)
  dir.create(dir, FALSE, TRUE)
  dir <- normalizePath(dir, "/", FALSE)
  paths <- paste0(dir, "/", c(
    "README.md", "site.R", "package.json", "server.js", ".gitignore", "build.R", "project.Rproj", "netlify.toml"
  ))
  if (overwrite) unlink(paths)
  if (!file.exists(paths[1])) {
    writeLines(c(
      paste("#", title),
      "<template: Describe the site>",
      "\n## Run",
      "```R",
      '# remotes::install_github("uva-bi-sdad/community")',
      "library(community)",
      "\n# from the site directory:",
      "site_build()",
      "```"
    ), paths[1])
  }
  if (!file.exists(paths[2])) {
    writeLines(c(
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
      '  output_table("variable", options = list(dom = "<\'row\'t>"))',
      ")",
      "",
      "# add a tooltip",
      "output_info(",
      '  body = c("variables.short_name" = "value"), row_style = "stack",',
      '  subto = "main_plot", floating = TRUE',
      ")",
      "",
      "# render the site:",
      paste0('site_build("', dir, '", bundle_data = TRUE, serve = TRUE, open_after = TRUE)')
    ), paths[2])
  }
  if (node_project && !file.exists(paths[3])) {
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
  if (node_project && !file.exists(paths[4])) {
    writeLines(c(
      "'use strict'",
      "const express = require('express'), app = express()",
      "app.use(express.static('docs'))",
      "app.listen(3000, function () {",
      "  console.log('listening on port 3000')",
      "})"
    ), paths[4])
  }
  if (!file.exists(paths[5])) {
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
      "docs/dist"
    ), paths[5])
  }
  if (!file.exists(paths[6])) {
    writeLines(c(
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
    ), paths[6])
  }
  if (!file.exists(paths[7]) && !any(grepl("\\.Rproj$", list.files(dir)))) writeLines("Version: 1.0\n", paths[7])
  if (include_api && !file.exists(paths[8])) {
    writeLines(c(
      "[build]",
      "  publish = 'docs'",
      "[[redirects]]",
      "  from = '/api'",
      "  to = '/.netlify/functions/api'",
      "  status = 200",
      "[functions]",
      "  directory = 'docs/functions'"
    ), paths[8])
  }
  dir.create(paste0(dir, "/docs"), FALSE)
  dir.create(paste0(dir, "/docs/functions"), FALSE)
  docs <- grep("/docs/", check$files, fixed = TRUE, value = TRUE)
  if (any(!file.exists(docs))) file.create(docs[!file.exists(docs)])
  if (with_data && !file.exists(paste0(dir, "/docs/data/datapackage.json"))) {
    dir.create(paste0(dir, "/docs/data"), FALSE)
    init_data(title, dir = paste0(dir, "/docs/data"), quiet = TRUE)
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
