#' Create a website
#'
#' Create a repository for a static, website for data documentation and exploration.
#'
#' @param title Title of the site.
#' @param dir Directory in which to create the site's directory.
#' @param with_data logical; if \code{FALSE}, a data sub-directory and package will not be created.
#' @param overwrite logical; if \code{TRUE}, will overwrite existing site files in \code{dir}.
#' @examples
#' \dontrun{
#' init_site("app")
#' }
#' @return Path to the created site directory.
#' @export

init_site <- function(title = "app", dir = ".", with_data = TRUE, overwrite = FALSE) {
  check <- check_template("site", dir = dir)
  if (check$exists && !overwrite) {
    cli_bullets(c(`!` = "site files already exist", i = "add {.code overwrite = TRUE} to overwrite them"))
  }
  dir <- normalizePath(paste0(dir, "/", check$spec$dir), "/", FALSE)
  dir.create(dir, FALSE, TRUE)
  paths <- paste0(dir, "/", c("README.md", "site.R", "settings.json", "package.json", "server.js", ".gitignore"))
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
      "",
      "# use `page_` functions to add parts of a page:",
      'page_navbar("Motor Trend Car Road Tests")',
      "",
      "# use `input_` functions to add input elements that affect outputs:",
      'input_select("variable", options = "variables", label = "Select a Variable", default = "wt")',
      "",
      "# use `output_` functions to data display components:",
      'output_plot("mpg", "variable")',
      "",
      "# render the site:",
      paste0('site_build("', dir, '", open_after = TRUE)'),
      ""
    ), collapse = "\n"), paths[2])
  }
  if (!file.exists(paths[3])) {
    write_json(list(
      title = title,
      theme = "default"
    ), paths[3], pretty = TRUE, auto_unbox = TRUE)
  }
  if (!file.exists(paths[4])) {
    write_json(list(
      name = gsub("\\s+", "_", tolower(title)),
      version = "1.0.0",
      description = "",
      main = "server.js",
      directories = list(doc = "docs"),
      scripts = list(start = "node server.js"),
      dependencies = list(express = "latest"),
      prettier = list(printWidth = 120, semi = FALSE, trailingComma = "es5"),
      author = "",
      license = "ISC"
    ), paths[4], pretty = TRUE, auto_unbox = TRUE)
  }
  if (!file.exists(paths[5])) {
    writeLines(paste(c(
      "'use strict'",
      "const express = require('express'), app = express()",
      "app.use(express.static('docs'))",
      "app.listen(3000, function () {",
      "  console.log('listening on port 3000')",
      "})",
      ""
    ), collapse = "\n"), paths[5])
  }
  if (!file.exists(paths[6])) {
    writeLines(paste(c(
      ".Rproj.user",
      ".Rhistory",
      ".Rdata",
      ".httr-oauth",
      ".DS_Store",
      "*.Rproj",
      "node-module",
      "package-lock.json",
      ""
    ), collapse = "\n"), paths[6])
  }
  dir.create(paste0(dir, "/docs"), FALSE)
  docs <- paste0(dir, "/docs/", c("index.html", "script.js", "style.css"))
  if (any(!file.exists(docs))) file.create(docs[!file.exists(docs)])
  if (with_data && !file.exists(paste0(dir, "/docs/data/datapackage.json"))) {
    dir.create(paste0(dir, "/docs/data"), FALSE)
    init_data(title, dir = dir, quiet = TRUE)
  }
  if (interactive()) {
    cli_bullets(c(
      v = "created a site skeleton for {title}:",
      "*" = paste0("{.path ", normalizePath(dir, "/", FALSE), "}")
    ))
    navigateToFile(paths[2])
  }
  invisible(dir)
}
