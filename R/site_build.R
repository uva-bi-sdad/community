#' Render a Website
#'
#' Write HTML output from the \code{site.R} file in a site project.
#'
#' @param dir Path to the site project directory.
#' @param file Name of the R file to build the site from.
#' @param outdir Subdirectory of \code{dir} in which to place the built site files (where the site is to be
#' served from).
#' @param name Name of the HTML file to be created.
#' @param variables A character vector of variable names to include from the data. If no specified,
#' all variables are included.
#' @param options A list with options to be passed to the site. These will be written to \code{settings.js},
#' which can be edited by hand.
#' @param bundle_data Logical; if \code{TRUE}, will write the data to the site file; useful when
#' running the site locally without server. Otherwise, the data will be loaded separately through an http request.
#' @param open_after Logical; if \code{TRUE}, will open the site in a browser after it is built.
#' @param force Logical; if \code{TRUE}, will reprocess data even if the source data is older than the existing
#' processed version.
#' @examples
#' \dontrun{
#' # run from within a site project directory, initialized with `init_site()`
#' site_build(".")
#'
#' # bundle data to most easily run locally
#' site_build(".", bundle_data = TRUE)
#' }
#' @return Invisible path to the written file.
#' @seealso To initialize a site project, use \code{\link{init_site}}.
#' @export

site_build <- function(dir, file = "site.R", outdir = "docs", name = "index.html", variables = NULL,
                       options = list(), bundle_data = FALSE, open_after = FALSE, force = FALSE) {
  if (missing(dir)) cli_abort('{.arg dir} must be specified (e.g., dir = ".")')
  page <- paste0(dir, "/", file)
  if (!file.exists(page)) cli_abort("{.file {page}} does not exist")
  out <- paste(c(dir, outdir, name), collapse = "/")
  parts <- new.env()
  attr(parts, "name") <- "community_site_parts"
  data_preprocess <- function() {
    ddir <- paste0(dir, "/docs/data/")
    f <- paste0(ddir, "datapackage.json")
    path <- paste0(dir, "/docs/")
    info <- list()
    if (file.exists(f)) {
      meta <- read_json(f)
      for (i in seq_along(meta$resources)) {
        d <- meta$resources[[i]]
        if (!is.null(variables)) {
          temp <- list()
          for (v in d$schema$fields) if (v$name %in% variables) temp[[v$name]] <- v
          variables <- variables[variables %in% names(temp)]
          d$schema$fields <- unname(temp[variables])
        }
        file <- paste0(ddir, d$filename)
        d$site_file <- paste0(d$name, ".json")
        path <- paste0(dir, "/docs/", d$site_file)
        if (file.exists(file)) {
          if (force || (!file.exists(path) || file.mtime(file) > file.mtime(path))) {
            data <- fread(file)
            if (!is.null(variables)) data <- data[, variables, with = FALSE]
            if (length(d$time) && d$time[[1]] %in% colnames(data)) {
              data <- data[order(data[[d$time[[1]]]]), ]
            }
            if (length(d$ids) && d$ids[[1]]$variable %in% colnames(data)) {
              ids <- data[[d$ids[[1]]$variable]]
              set(data, NULL, d$ids[[1]]$variable, NULL)
            } else {
              ids <- rownames(data)
            }
            rownames(data) <- NULL
            write_json(split(data, ids), path, dataframe = "columns")
          }
          info[[d$name]] <- d
        }
      }
    } else {
      data_files <- list.files(ddir, "\\.(csv|tsv|txt)")
      if (length(data_files)) {
        init_data(sub("^.*/", "", normalizePath(dir, "/", FALSE)), dir = dir, data_paths = data_files)
        if (file.exists(f)) {
          return(data_preprocess(dir, outdir))
        }
      }
    }
    list(
      package = if (file.exists(f)) sub(paste0(dir, "/docs/"), "", f, fixed = TRUE),
      datasets = if (length(meta$resources) == 1) list(names(info)) else names(info),
      variables = variables,
      info = info,
      files = names(sort(vapply(info, "[[", 0, "bytes")))
    )
  }
  path <- paste0(dir, "/docs/settings.js")
  settings <- if (file.exists(path) && file.size(path)) {
    fromJSON(sub("^[^{]*", "", paste(readLines(path, warn = FALSE), collapse = "")))
  } else {
    list(settings = options)
  }
  defaults <- list(
    digits = 3, summary_selection = "all", color_by_order = FALSE, boxplots = TRUE,
    theme_dark = FALSE, partial_init = TRUE, palette = "rdylbu7", hide_url_parameters = FALSE,
    background_shapes = TRUE
  )
  for (s in names(defaults)) {
    if (!is.null(options[[s]])) {
      settings$settings[[s]] <- options[[s]]
    } else if (is.null(settings$settings[[s]])) settings$settings[[s]] <- defaults[[s]]
  }
  if (!is.null(settings$metadata) && !is.null(settings$metadata$variables) &&
    !identical(settings$metadata$variables, variables[variables != "_references"])) {
    force <- TRUE
  }
  settings$metadata <- data_preprocess()
  parts$dependencies <- list(
    base_style = list(type = "stylesheet", src = "https://uva-bi-sdad.github.io/community/dist/css/community.min.css"),
    base = list(type = "script", src = "https://uva-bi-sdad.github.io/community/dist/js/community.min.js"),
    custom_style = list(type = "stylesheet", src = "style.css"),
    custom = list(type = "script", src = "script.js"),
    bootstrap_style = list(
      type = "stylesheet",
      src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
      hash = "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
    ),
    bootstrap = list(
      type = "script",
      src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
      hash = "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
    )
  )
  parts$credits$bootstrap <- list(
    name = "Bootstrap",
    url = "https://getbootstrap.com",
    version = "5.1.3"
  )
  parts$header <- NULL
  parts$body <- NULL
  src <- parse(text = gsub("community::site_build", "site_build", readLines(page, warn = FALSE), fixed = TRUE))
  parts$site_build <- function(...) {}
  parts$uid <- 0
  source(local = parts, exprs = src)
  for (e in c(
    "rules", "variables", "dataviews", "info", "text", "select", "tables", "plots", "maps", "credits",
    "credit_output"
  )) {
    settings[[e]] <- if (length(parts[[e]])) if (is.list(parts[[e]])) parts[[e]] else list(parts[[e]]) else NULL
  }
  if (!is.null(settings$maps)) {
    settings$maps[["_raw"]] <- list()
    for (m in settings$map) {
      if (!is.null(m$shapes)) {
        for (s in m$shapes) {
          if (file.exists(s$url)) {
            settings$maps[["_raw"]][[s$url]] <- paste(readLines(s$url), collapse = "")
          }
        }
      }
    }
  }
  writeLines(
    paste0("const site = ", toJSON(settings, pretty = TRUE, auto_unbox = TRUE)),
    paste0(dir, "/docs/settings.js")
  )
  r <- c(
    "<!doctype html>",
    paste("<!-- page generated from", sub("^.*/", "", file), "by community::site_build() -->"),
    '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">',
    "<head>",
    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
    '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />',
    '<meta name="viewport" content="width=device-width,initial-scale=1" />',
    '<script type="application/javascript" src="settings.js"></script>',
    if (bundle_data) {
      paste0(
        '<script type="application/javascript">\nsite.data = {',
        paste(
          vapply(settings$metadata$files, function(f) {
            paste0('"', f, '": ', paste(
              readLines(paste0(dir, "/docs/", f, ".json"), warn = FALSE),
              collapse = ""
            ), ",\n")
          }, ""),
          collapse = ""
        ),
        "}\n</script>"
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
    if (!is.null(parts$header)) parts$header,
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
