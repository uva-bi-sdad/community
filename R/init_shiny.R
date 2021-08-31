#' Create a new Shiny app
#'
#' Create the basic structure of a Shiny application.
#'
#' @param name Name of the app, corresponding to the directory name.
#' @param dir Directory in which to make the parent directory of the app.
#' @param overwrite Logical; if \code{TRUE}, existing files will be overwritten.
#' @examples
#' \dontrun{
#' init_shiny("test")
#' }
#' @return Path to the created app directory.
#' @export

init_shiny <- function(name, dir = ".", overwrite = FALSE) {
  if (missing(name)) cli_abort("{.arg name} must be specified")
  check <- check_template("shiny", name, dir = dir)
  if (check$exists && !overwrite) {
    cli_abort(c("app files already exist", i = "add {.code overwrite = TRUE} to overwrite them"))
  }
  dir <- normalizePath(paste0(dir, "/", check$spec$dir), "/", FALSE)
  dir.create(dir, FALSE, TRUE)
  paths <- paste0(dir, "/", c("README.md", "app.R"))
  writeLines(paste0(
    "# ", name,
    "\n<template: Describe the app>",
    "\n\n## Run",
    "\n```R",
    "\n# install.package(\"shiny\")",
    "\nlibrary(shiny)",
    "\n\n# from the `app` parent directory:",
    "\nrunApp(\"app\")",
    "\n```"
  ), paths[1])
  writeLines(paste0(
    "library(shiny)",
    "\n",
    "\n# One-time processes, when app starts",
    "\n## <template: put things like initial data loading here>",
    "\n",
    "\n# User Interface, runs once to compile HTML",
    "\nui <- fluidPage(\n\n)",
    "\n",
    "\n# Server, runs each time a user visits the site",
    "\nserver <- function(input, output){\n\n}",
    "\n",
    "\n# Creates the app object, which is run when printed or its output is passed to `runApp`",
    "\nshinyApp(ui, server)"
  ), paths[2])
  if (interactive()) {
    cli_bullets(c(v = "created a Shiny skeleton for {name}:", "*" = paste0("{.path ", dir, "}")))
    navigateToFile(paths[2])
  }
  invisible(dir)
}
