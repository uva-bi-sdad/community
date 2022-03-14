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
#' @param execute Logical; if \code{FALSE}, will create/update, but not run the view.
#' @param overwrite Logical; if \code{TRUE}, replaces any existing view files.
#' @param verbose Logical; if \code{FALSE}, will not show status messages.
#' @examples
#' \dontrun{
#' # create a view within a data commons project
#' datacommons_view(".", "view_name", variables = c("variable_a", "variable_b"))
#'
#' # refresh that view
#' datacommons_view(".", "view_name")
#' }
#' @return An invisible version of the view list (the view's view.json file).
#' @export

datacommons_view <- function(commons, name, output = NULL, ..., variables = NULL, ids = NULL,
                             files = NULL, run_after = NULL, run_before = NULL, measure_info = list(),
                             execute = TRUE, overwrite = FALSE, verbose = TRUE) {
  if (missing(commons)) cli_abort('{.arg commons} must be speficied (e.g., commons = ".")')
  if (missing(name)) {
    name <- list.files(paste0(commons, "/views"))[1]
    if (is.na(name)) cli_abort("{.arg name} must be specified since no views are present in {commons}")
  }
  check <- check_template("datacommons", dir = commons)
  if (overwrite) unlink(check$files, TRUE)
  view_dir <- normalizePath(paste0(commons, "/views/", name), "/", FALSE)
  dir.create(view_dir, FALSE, TRUE)
  paths <- paste0(view_dir, "/", c("view.json", "manifest.json", "run_after.R", "run_before.R"))
  if (overwrite) unlink(paths)
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
      output = output,
      run_after = run_after,
      run_before = run_before,
      variables = variables,
      ids = ids,
      files = files
    )
    write_view <- TRUE
  } else {
    view <- read_json(paths[1])
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
    if (verbose && write_view) cli_alert_info("updating existing {.file view.json}")
  }
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
    map_file <- paste0(commons, "/cache/variable_map.csv")
    map <- if (!file.exists(map_file)) {
      if (verbose) cli_alert_info("mapping commons files")
      datacommons_map_variables(commons, verbose = verbose)
    } else {
      read.csv(map_file)
    }
    files <- map[(if (length(view$files)) grepl(view$files, map$file) else TRUE) &
      (map$full_name %in% view$variables | map$variable %in% view$variables), , drop = FALSE]
    if (nrow(files)) {
      files <- files[!duplicated(files$full_name), , drop = FALSE]
      if (verbose) cli_alert_info("updating manifest: {.file {paths[2]}}")
      write_json(lapply(split(files, files$repo), function(r) {
        unname(lapply(split(r, r$file), function(f) {
          list(
            file = basename(f$file[[1]]),
            file_date = file.mtime(f$file[[1]]),
            md5 = unname(md5sum(f$file[[1]])),
            variables = f$full_name
          )
        }))
      }), paths[2], pretty = TRUE, auto_unbox = TRUE)
      if (is.character(measure_info)) {
        measure_info <- if (length(measure_info) == 1 && file.exists(measure_info)) read_json(measure_info) else as.list(measure_info)
      }
      for (r in unique(files$repo)) {
        rf <- paste0(commons, "/repos/", r, "/docs/data/measure_info.json")
        if (file.exists(rf)) {
          ri <- read_json(rf)
          ri <- ri[!names(ri) %in% names(measure_info)]
          if (length(ri)) measure_info[names(ri)] <- ri
        }
      }
      if (length(measure_info)) {
        measure_info_file <- paste0(view$output, "/measure_info.json")
        if (verbose) cli_alert_info("updating measure info: {.file {measure_info_file}}")
        write_json(rev(measure_info), measure_info_file, pretty = TRUE, auto_unbox = TRUE)
      }
      args <- list(...)
      args$files <- unique(files$file)
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
  }
  invisible(view)
}
