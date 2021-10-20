#' Render a Website
#'
#' Write HTML output from the \code{site.R} file in a site project.
#'
#' @param dir Path to the site project directory.
#' @param file Name of the R file to build the site from.
#' @param outdir Path to place the .
#' @param name Path to the site project directory.
#' @param variables A character vector of variable names to include from the data. If no specified,
#' all variables are included.
#' @param bundle_data Logical; if \code{TRUE}, will write the data to the site file; useful when
#' running the site locally without server. Otherwise, the data will be loaded separately through an http request.
#' @param open_after Logical; if \code{TRUE}, will open the site in a browser after it is built.
#' @param force Logical; if \code{TRUE}, will reprocess data even if the source data is older than the existing
#' processed version.
#' @examples
#' \dontrun{
#' # run from within a site project directory, initialized with `init_site()`
#' site_build()
#' }
#' @return Invisible path to the written file.
#' @seealso To initialize a site project, use \code{\link{init_site}}.
#' @export

site_build <- function(dir = ".", file = "site.r", outdir = "docs", name = "index.html", variables = NULL,
                       bundle_data = FALSE, open_after = FALSE, force = FALSE) {
  page <- paste0(dir, "/", file)
  if (!file.exists(page)) cli_abort("{.file {page}} does not exist")
  out <- paste(c(dir, outdir, name), collapse = "/")
  parts <- new.env()
  attr(parts, "name") <- "community_site_parts"
  data_preprocess <- function() {
    ddir <- paste0(dir, "/docs/data/")
    f <- paste0(ddir, "datapackage.json")
    path <- paste0(dir, "/docs/data.json")
    last_updated <- if (file.exists(path)) file.mtime(path) else -Inf
    updated <- FALSE
    json_data <- list()
    info <- list()
    if (file.exists(f)) {
      meta <- read_json(f)
      for (i in seq_along(meta$resources)) {
        d <- meta$resources[[i]]
        file <- paste0(ddir, d$filename)
        if (file.exists(file)) {
          if (force || !is.null(variables) || file.mtime(file) > last_updated) {
            updated <- TRUE
            data <- fread(file)
            if (!is.null(variables)) {
              d$schema$fields <- Filter(function(v) v$name %in% variables, d$schema$fields)
              data <- data[, ..variables]
            }
            if (length(d$time) && d$time[[1]] %in% colnames(data)) {
              data <- data[order(data[[d$time[[1]]]]), ]
            }
            if (length(d$ids) && d$ids[[1]]$variable %in% colnames(data)) {
              ids <- data[[d$ids[[1]]$variable]]
              data <- data[, d$ids[[1]]$variable := NULL]
            } else {
              ids <- rownames(data)
            }
            rownames(data) <- NULL
            json_data[[d$name]] <- split(data, ids)
          }
          info[[d$name]] <- d
        }
      }
      if (length(json_data) == 1) {
        json_data <- json_data[[1]]
        info <- info[[1]]
      }
    } else {
      data_files <- list.files(ddir, "\\.(csv|tsv|txt)")
      if (length(data_files)) {
        init_data(sub("^.*/", "", normalizePath(dir, "/", FALSE)), dir = dir, data_paths = data_files)
        if (file.exists(f)) {
          return(data_preprocess(dir, outdir))
        }
      }
      json_data <- list()
    }
    if (updated && length(json_data)) write_json(json_data, path, dataframe = "columns")
    list(
      package = if (file.exists(f)) sub(paste0(dir, "/docs/"), "", f, fixed = TRUE),
      datasets = if (length(meta$resources) == 1) info$name else names(info),
      info = info,
      file = if (file.exists(path)) sub(paste0(dir, "/docs/"), "", path, fixed = TRUE)
    )
  }
  settings <- read_json(paste0(dir, "/settings.json"))
  settings$metadata <- data_preprocess()
  write_json(settings, paste0(dir, "/settings.json"), pretty = TRUE, auto_unbox = TRUE)
  parts$dependencies <- list(
    base_style = list(type = "stylesheet", src = "https://uva-bi-sdad.github.io/community/dist/css/community.min.css"),
    base = list(type = "script", src = "https://uva-bi-sdad.github.io/community/dist/js/community.min.js"),
    custom_style = list(type = "stylesheet", src = "style.css"),
    custom = list(type = "script", src = "script.js"),
    bootstrap_style = list(
      type = "stylesheet",
      src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css",
      hash = "sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU"
    ),
    bootstrap = list(
      type = "script",
      src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js",
      hash = "sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ"
    )
  )
  parts$header <- NULL
  parts$body <- NULL
  src <- parse(text = gsub("community::site_build", "site_build", readLines(page), fixed = TRUE))
  parts$site_build <- function(...) {}
  parts$uid <- 0
  source(local = parts, exprs = src)
  r <- c(
    "<!doctype html>",
    paste("<!-- page generated from", sub("^.*/", "", file), "by community::site_build() -->"),
    '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">',
    "<head>",
    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
    '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />',
    '<meta name="viewport" content="width=device-width,initial-scale=1" />',
    paste(c(
      '<script type="application/javascript">\nconst site = ',
      toJSON(c(
        settings,
        rules = if ("rules" %in% names(parts)) list(parts$rules),
        variables = if ("variables" %in% names(parts)) list(parts$variables),
        dataviews = if ("dataviews" %in% names(parts)) list(parts$dataviews),
        info = if ("info" %in% names(parts)) list(parts$info),
        tables = if (length(parts$tables)) list(parts$tables),
        plots = if ("plots" %in% names(parts)) list(parts$plots),
        maps = if ("maps" %in% names(parts)) list(parts$maps)
      ), auto_unbox = TRUE),
      "\n</script>"
    ), collapse = ""),
    if (bundle_data) {
      paste0(
        '<script type="application/javascript">\nsite.data = ',
        readLines(paste0(dir, "/docs/data.json")),
        "\n</script>"
      )
    },
    unlist(lapply(parts$dependencies[c(seq_len(length(parts$dependencies) - 4) + 4, 1:4)], function(d) {
      if (!d$src %in% c("script.js", "style.css") || (file.exists(paste0(dir, "/docs/", d$src)) &&
        file.size(paste0(dir, "/docs/", d$src)))) {
        paste(c(
          "<", if (d$type == "script") 'script type="application/javascript" src="' else 'link href="', d$src, '"',
          if (!is.null(d$hash)) c(' integrity="', d$hash, '"', ' crossorigin="anonymous"'),
          if (d$type == "stylesheet") ' rel="stylesheet" media="all"',
          " ", if (!is.null(d$loading)) d$loading else "async", ">", if (d$type == "script") "</script>"
        ), collapse = "")
      }
    })),
    paste0('<meta name="generator" content="community v', packageVersion("community"), '" />'),
    unlist(parts$head[!duplicated(names(parts$head))], use.names = FALSE),
    "</head>",
    "<body>",
    if (!is.null(parts$header)) {
      c(
        '<div class="navbar">',
        parts$header,
        "</div>"
      )
    },
    if (!is.null(parts$body)) parts$body,
    if (!is.null(parts$content)) {
      c(
        '<div class="content container-fluid">',
        parts$content,
        "</div>"
      )
    },
    parts$script,
    "</body>",
    "</html>"
  )
  writeLines(r, out)
  if (interactive()) {
    cli_bullets(c(v = paste("built", name, "file:"), "*" = paste0("{.path ", out, "}")))
    if (open_after) viewer(out)
  }
  invisible(out)
}
