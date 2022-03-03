#' Refresh Data Commons Repositories
#'
#' Clone and/or pull repositories that are part of a data commons project.
#'
#' @param dir Directory of the data commons projects, as created by \code{\link{init_datacommons}}.
#' @param clone_method Means of cloning new repositories; either \code{"http"} (default) or \code{"ssh"}.
#' @param include_distributions Logical; if \code{TRUE}, will attempt to locate and cache copies of datasets
#' pointed to from the data repositories (so far just from Dataverse, implicitly from DOI files).
#' @param only_new Logical; if \code{TRUE}, only repositories that do not yet exist will be processed.
#' @param quiet Logical; if \code{TRUE}, will not show updated repositories.
#' @examples
#' \dontrun{
#' # refresh from a data commons working directory
#' datacommons_refresh(".")
#' }
#' @return An invisible character vector of updated repositories.
#' @export

datacommons_refresh <- function(dir, clone_method = "http", include_distributions = TRUE,
                                only_new = FALSE, quiet = FALSE) {
  if (missing(dir)) cli_abort('{.arg dir} must be specified (e.g., as ".")')
  if (Sys.which("git") == "") {
    cli_abort(c(
      x = "the {.emph git} command could not be located",
      i = "install git if necessary: {.url https://git-scm.com/downloads}"
    ))
  }
  check <- check_template("datacommons", dir = dir)
  if (!check$exists) {
    cli_abort(c(
      x = "{.arg dir} does not appear to point to a data commons project",
      i = paste0('initialize it with {.code init_datacommons("', dir, '")}')
    ))
  }
  repos <- Filter(length, readLines(paste0(dir, "/repo_list.txt")))
  if (!length(repos)) cli_abort("no repositories are listed in {.file repo_list.txt}.")
  info <- read_json(paste0(dir, "/info.json"))
  repos <- gsub("^[\"']+|['\"]+$|^.*github\\.com/", "", repos)
  su <- !grepl("/", repos, fixed = TRUE)
  if (any(su)) {
    if (info$default_user == "") {
      cli_abort(c(
        x = "repo{?s are/ is} missing a username prefix: {.files {repos[su]}}",
        i = "add these, or fill in the default user in {.file info.json}"
      ))
    }
    repos[su] <- paste0(info$default_user, "/", repos[su])
  }
  repos <- sub("^([^/]+/[^/#@]+).*$", "\\1", repos)
  if (only_new) {
    repos <- repos[!file.exists(paste0(dir, "/repos/", sub("^.*/", "", repos)))]
    if (!length(repos)) {
      if (!quiet) cli_alert_success("no new repositories")
      return(invisible(repos))
    }
  }
  updated <- logical(length(repos))
  wd <- getwd()
  on.exit(setwd(wd))
  dir.create(paste0(dir, "/repos"), FALSE, TRUE)
  setwd(paste0(dir, "/repos"))
  method <- if (clone_method == "ssh") "git@github.com:" else "https://github.com/"
  if (include_distributions) dir.create("../cache", FALSE)
  for (i in seq_along(repos)) {
    r <- repos[[i]]
    rn <- sub("^.*/", "", r)
    if (!quiet) cli_alert_info(paste(if (dir.exists(rn)) "pulling" else "cloning", rn))
    s <- tryCatch(if (dir.exists(rn)) {
      shell(paste("cd", rn, "&& git pull"), intern = TRUE)
    } else {
      system2("git", c("clone", paste0(method, r, ".git")), stdout = TRUE)
    }, error = function(e) e$message)
    if (length(s) == 1 && s != "Already up to date.") {
      if (!is.null(attr(s, "status"))) {
        cli_alert_warning(c(
          x = paste0("failed to retrieve ", r, ":"),
          structure(s, names = rep("!", length(s)))
        ))
      } else {
        updated[i] <- TRUE
      }
    } else if (!length(list.files(rn))) system2("rm", c("-rf", rn))
    if (include_distributions) {
      dataset_doi <- NULL
      if (file.exists(paste0(rn, "/R/sysdata.rda"))) {
        load(paste0(rn, "/R/sysdata.rda"))
        if (!is.null(dataset_doi)) {
          if (!quiet) {
            ul <- cli_ul()
            iul <- cli_ul()
            cli_li("including Dataverse distribution for {.emph {dataset_doi}}")
          }
          meta <- tryCatch(download_dataverse_info(dataset_doi), error = function(e) NULL)
          if (is.null(meta)) {
            if (!quiet) {
              cli_li(col_red("failed to download Dataverse metadata for {.emph {dataset_doi}}"))
              cli_end(iul)
              cli_end(ul)
            }
          } else {
            dir.create(paste0("../cache/", rn), FALSE)
            write_json(meta, paste0("../cache/", rn, "/dataverse_metadata.json"), pretty = TRUE, auto_unbox = TRUE)
            if (length(meta$latestVersion$files)) {
              for (f in meta$latestVersion$files) {
                existing <- paste0("../cache/", rn, "/", f$dataFile$filename)
                if (file.exists(existing)) {
                  if (!quiet) cli_li("checking existing version of {.file {f$dataFile$filename}}")
                  if (md5sum(existing) == f$dataFile$md5) break
                }
                if (!quiet) cli_li("downloading {.file {f$dataFile$filename}}")
                res <- tryCatch(download_dataverse_data(
                  dataset_doi, paste0("../cache/", rn),
                  files = f$label, load = FALSE, decompress = FALSE
                ), error = function(e) NULL)
                if (!quiet && is.null(res)) cli_li(col_red("failed to download {.file {f$dataFile$filename}}"))
              }
            }
          }
          if (!quiet) {
            cli_end(iul)
            cli_end(ul)
          }
        }
      }
    }
  }
  repos <- repos[updated]
  if (!quiet) {
    cli_alert_success(if (any(updated)) {
      "updated data repositorie{?s}: {.file {repos}}"
    } else {
      "all data repositories are up to date"
    })
  }
  invisible(repos)
}
