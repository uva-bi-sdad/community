#' Interact with a Data Commons View
#'
#' Add, edit, or refresh a view within a data commons project.
#'
#' @param commons Path to the data commons project.
#' @param name Name of the view (it's directory in the project's \code{"views"} directory).
#' Defaults to the first view.
#' @param output Path to a site project's main directory.
#' @param ... Passes arguments to \code{\link{data_reformat_sdad}} if the view is to be executed.
#' @param variables A vector of variables, to be added to the view's \code{view.json} file.
#' @param ids A vector of ids, to be added to the view's \code{view.json} file.
#' @param files A regular expression string used to filter files containing \code{variables}.
#' @param run_after Path to a script to be sourced after refreshing the view, or code to
#' be added to such a script (e.g., \code{"../data_site/build.R"}).
#' @param run_before Path to a script to be sourced before refreshing the view, or code to
#' be added to such a script.
#' @param measure_info A list of variable metadata to include in the \code{measure_info.json}
#' file created from such files in each data repository (such as general entries like
#' \code{"_references"}). These will supersede any entries of the same name found in data repositories.
#' @param remote Name of the view's GitHub repository (\code{"username/reponame"}).
#' @param url URL of the view's site; defaults to the GitHub Pages URL associated with \code{remote}
#' if provided (\code{"https://username.github.io/reponame"}).
#' @param children A list of child sites associated with the view. Each entry should contain at least a
#' \code{remote} entry (GitHub repository, including user name and repo name), and optionally \code{name}
#' and \code{url} (link to the served site), which will otherwise be derived from \code{remote}.
#' @param execute Logical; if \code{FALSE}, will create/update, but not run the view.
#' @param prefer_repo Logical; if \code{TRUE}, will prefer repository files over those from distributions
#' (such as Dataverse).
#' @param refresh_map Logical; if \code{TRUE}, overwrites any existing map files.
#' @param overwrite Logical; if \code{TRUE}, reformatted files in \code{output}.
#' @param verbose Logical; if \code{FALSE}, will not show status messages.
#' @examples
#' \dontrun{
#' # create a view within a data commons project
#' datacommons_view(".", "view_name", variables = c("variable_a", "variable_b"))
#'
#' # refresh that view
#' datacommons_view(".", "view_name")
#' }
#' @return An invisible version of the view list (the view's \code{view.json} file).
#' @export

datacommons_view <- function(commons, name, output = NULL, ..., variables = NULL, ids = NULL,
                             files = NULL, run_after = NULL, run_before = NULL, measure_info = list(),
                             remote = NULL, url = NULL, children = list(), execute = TRUE, prefer_repo = FALSE,
                             refresh_map = FALSE, overwrite = FALSE, verbose = TRUE) {
  if (missing(commons)) cli_abort('{.arg commons} must be speficied (e.g., commons = ".")')
  if (missing(name)) {
    name <- list.files(paste0(commons, "/views"))[1]
    if (is.na(name)) cli_abort("{.arg name} must be specified since no views are present in {commons}")
  }
  check <- check_template("datacommons", dir = commons)
  view_dir <- normalizePath(paste0(commons, "/views/", name), "/", FALSE)
  dir.create(view_dir, FALSE, TRUE)
  paths <- paste0(view_dir, "/", c("view.json", "manifest.json", "run_after.R", "run_before.R"))
  if (!is.null(run_after) && (length(run_after) > 1 || !file.exists(run_after))) {
    if (verbose) cli_alert_info("writting {.file run_after.R}")
    writeLines(run_after, paths[3])
    run_after <- paths[3]
  }
  if (!is.null(run_before) && (length(run_before) > 1 || !file.exists(run_before))) {
    if (verbose) cli_alert_info("writting {.file run_before.R}")
    writeLines(run_before, paths[4])
    run_before <- paths[4]
  }
  write_view <- FALSE
  if (!is.null(variables)) variables <- variables[!grepl("^_", variables)]
  if (!file.exists(paths[1])) {
    if (verbose) cli_alert_info("writting new {.file view.json}")
    view <- list(
      name = name,
      remote = remote,
      url = url,
      output = output,
      run_after = run_after,
      run_before = run_before,
      variables = variables,
      ids = ids,
      files = files,
      children = children
    )
    write_view <- TRUE
  } else {
    view <- read_json(paths[1])
    if (!is.null(remote) && !identical(view$remote, remote)) {
      view$remote <- remote
      write_view <- TRUE
    }
    if (!is.null(url) && !identical(view$url, url)) {
      view$url <- url
      write_view <- TRUE
    }
    if (!is.null(output) && !identical(view$output, output)) {
      view$output <- output
      write_view <- TRUE
    }
    if (!is.null(run_after) && !identical(view$run_after, run_after)) {
      view$run_after <- run_after
      write_view <- TRUE
    }
    if (!is.null(run_before) && !identical(view$run_before, run_before)) {
      view$run_before <- run_before
      write_view <- TRUE
    }
    if (!is.null(variables) && !identical(view$variables, variables)) {
      view$variables <- unique(c(view$variables, variables))
      write_view <- TRUE
    }
    if (!is.null(ids) && !identical(view$ids, ids)) {
      view$ids <- unique(c(view$ids, ids))
      write_view <- TRUE
    }
    if (!is.null(ids) && !identical(view$files, files)) {
      view$files <- files
      write_view <- TRUE
    }
    if (!is.null(children) && !identical(view$children, children)) {
      view$children <- children
      write_view <- TRUE
    }
    if (verbose && write_view) cli_alert_info("updating existing {.file view.json}")
  }
  if (!is.null(view$remote) && is.null(view$url)) {
    remote_parts <- strsplit(sub("^(?:http?://)?(?:www\\.)?github\\.com/", "", view$remote), "/")[[1]]
    view$url <- paste0("https://", remote_parts[1], ".github.io/", remote_parts[2])
  }
  if (length(view$children)) {
    if (!is.null(names(view$children))) view$children <- list(view$children)
    view$children <- lapply(view$children, function(ch) {
      if (is.null(ch$name)) {
        ch$name <- sub("^.*/", "", ch$remote)
      }
      if (is.null(ch$url)) {
        remote_parts <- strsplit(sub("^(?:http?://)?(?:www\\.)?github\\.com/", "", ch$remote), "/")[[1]]
        ch$url <- paste0("https://", remote_parts[1], ".github.io/", remote_parts[2])
      }
      ch
    })
  }
  if (length(view$variables)) view$variables <- as.character(view$variables)
  if (length(view$ids)) view$ids <- as.character(view$ids)
  view$output <- paste0(sub("/docs(?:/data)?", "", if (is.null(view$output)) view_dir else view$output), "/docs/data")
  if (write_view) write_json(view, paths[1], pretty = TRUE, auto_unbox = TRUE)
  if (execute) {
    source_env <- new.env()
    source_env$datacommons_view <- function(...) {}
    if (length(view$run_before) && file.exists(view$run_before)) {
      if (verbose) cli_alert_info("running pre-view script ({.file {view$run_before}})")
      src <- parse(text = gsub("community::datacommons_view", "datacommons_view", readLines(view$run_before, warn = FALSE), fixed = TRUE))
      source(local = source_env, exprs = src)
    }
    if (verbose) cli_alert_info("checking for file maps")
    map <- datacommons_map_files(commons, overwrite = refresh_map, verbose = verbose)
    files <- map$variables[
      (if (length(view$files)) grepl(view$files, map$variables$file) else TRUE) &
        (if (length(view$variables)) (map$variables$full_name %in% view$variables | map$variables$variable %in% view$variables) else TRUE) &
        (if (length(view$ids)) {
          map$variables$file %in% sub("^/", "", unique(unlist(
            lapply(map$ids[view$ids %in% names(map$ids)], "[[", "files"),
            use.names = FALSE
          )))
        } else {
          TRUE
        }), ,
      drop = FALSE
    ]
    if (nrow(files)) {
      cfs <- paste0("/", files$file)
      files <- files[order(
        grepl(if (prefer_repo) "cache/" else "repos/", files$file) -
          Reduce("+", lapply(view$ids, function(id) cfs %in% map$ids[[id]]$file))
      ), ]
      files <- files[!duplicated(paste(files$full_name, basename(files$file))), , drop = FALSE]
      sel_files <- unique(unlist(lapply(split(files, files$full_name), function(fs) {
        if (nrow(fs) == 1) {
          fs$file
        } else {
          ccfs <- paste0("/", fs$file)
          ifm <- vapply(map$ids[view$ids], function(im) ccfs %in% im$files, logical(length(ccfs)))
          is <- colSums(ifm) != 0
          sel <- NULL
          for (i in seq_along(ccfs)) {
            if (any(is[ifm[i, ]])) {
              sel <- c(sel, fs$file[i])
              is[ifm[i, ]] <- FALSE
            }
          }
          sel
        }
      }), use.names = FALSE))
      files <- files[files$file %in% sel_files, ]
      if (verbose) cli_alert_info("updating manifest: {.file {paths[2]}}")
      repo_manifest <- read_json(paste0(commons, "/manifest/repos.json"))
      manifest <- lapply(split(files, files$repo), function(r) {
        hr <- repo_manifest[[r$repo[[1]]]]
        files <- paste0(commons, "/", unique(r$file))
        list(
          repository = r$repo[[1]],
          files = lapply(files, function(f) {
            name <- basename(f)
            if (grepl("repos/", f, fixed = TRUE)) {
              m <- hr$files[[name]]
              m$baseurl <- hr$url
            } else {
              m <- hr$distributions$dataverse$files[[name]]
              m$baseurl <- hr$distributions$dataverse$server
            }
            m
          })
        )
      })
      if (is.character(measure_info)) {
        measure_info <- if (length(measure_info) == 1 && file.exists(measure_info)) read_json(measure_info) else as.list(measure_info)
      }
      for (r in unique(files$repo)) {
        rf <- list.files(paste0(commons, "/repos/", sub("^.+/", "", r)), "^measure_info[^.]*\\.json$", full.names = TRUE, recursive = TRUE)
        if (length(rf)) {
          ri <- unlist(lapply(rf, read_json), recursive = FALSE)
          nri <- names(ri)
          es <- nri[grepl("^_", nri) & !nri %in% view$variables]
          if (length(es)) {
            for (e in es) {
              if (!is.null(names(ri[[e]]))) {
                if (is.null(measure_info[[e]])) measure_info[[e]] <- list()
                su <- !names(ri[[e]]) %in% names(measure_info[[e]])
                if (any(su)) measure_info[[e]] <- c(measure_info[[e]], ri[[e]][su])
              }
            }
          }
          ri <- ri[nri %in% view$variables & !nri %in% names(measure_info)]
          if (length(ri)) measure_info[names(ri)] <- ri
        }
      }
      if (length(measure_info)) {
        measure_info_file <- paste0(view$output, "/measure_info.json")
        if (verbose) cli_alert_info("updating measure info: {.file {measure_info_file}}")
        write_json(rev(measure_info), measure_info_file, pretty = TRUE, auto_unbox = TRUE)
      }
      args <- list(...)
      args$files <- paste0(commons, "/", unique(files$file))
      args$out <- view$output
      args$variables <- view$variables
      args$ids <- view$ids
      args$overwrite <- overwrite
      args$verbose <- verbose
      do.call(data_reformat_sdad, args)
    } else {
      cli_warn("no files were found")
    }
    if (length(view$run_after) && file.exists(view$run_after)) {
      if (verbose) cli_alert_info("running post-view script ({.file {view$run_after}})")
      src <- parse(text = gsub("community::datacommons_view", "datacommons_view", readLines(view$run_after, warn = FALSE), fixed = TRUE))
      source(local = source_env, exprs = src)
    }
    write_json(manifest, paste0(view$output, "/manifest.json"), pretty = TRUE, auto_unbox = TRUE)
  }
  init_datacommons(commons, refresh_after = FALSE, verbose = FALSE)
  invisible(view)
}
