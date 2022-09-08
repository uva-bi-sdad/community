#' Refresh Data Commons Repositories
#'
#' Clone and/or pull repositories that are part of a data commons project.
#'
#' @param dir Directory of the data commons projects, as created by \code{\link{init_datacommons}}.
#' @param clone_method Means of cloning new repositories; either \code{"http"} (default) or \code{"ssh"}.
#' @param include_distributions Logical; if \code{TRUE} (default), will attempt to locate and cache copies of datasets
#' pointed to from the data repositories (so far just from Dataverse, implicitly from DOI files).
#' @param refresh_distributions Logical; if \code{TRUE}, will download fresh copies of the distribution metadata.
#' @param only_new Logical; if \code{TRUE}, only repositories that do not yet exist will be processed.
#' @param reset_repos Logical; if \code{TRUE}, will fetch and hard reset the repositories to remove any local changes.
#' @param rescan_only Logical; if \code{TRUE}, will only read the files that are already in place, without checking for
#' updates from the remote repository.
#' @param use_manifest Logical; if \code{FALSE}, will search for files rather than using a \code{manifest.json} file in each
#' repository. Each manifest should contain an object with a \code{data} entry containing an object array with \code{path}
#' entries (e.g., \code{'{"data": [{"path": "path/from/repos/repo_name/data.csv"}]}'}).
#' @param verbose Logical; if \code{FALSE}, will not show updated repositories.
#' @examples
#' \dontrun{
#' # refresh from a data commons working directory
#' datacommons_refresh(".")
#' }
#' @return An invisible character vector of updated repositories.
#' @export

datacommons_refresh <- function(dir, clone_method = "http", include_distributions = TRUE, refresh_distributions = FALSE,
                                only_new = FALSE, reset_repos = FALSE, rescan_only = FALSE, use_manifest = TRUE, verbose = TRUE) {
  if (missing(dir)) cli_abort('{.arg dir} must be specified (e.g., as ".")')
  if (Sys.which("git") == "") {
    cli_abort(c(
      x = "the {.emph git} command could not be located",
      i = "you might need to install git: {.url https://git-scm.com/downloads}"
    ))
  }
  check <- check_template("datacommons", dir = dir)
  if (!check$exists) {
    cli_abort(c(
      x = "{.arg dir} does not appear to point to a data commons project",
      i = paste0('initialize it with {.code init_datacommons("', dir, '")}')
    ))
  }
  dir <- normalizePath(dir, "/", FALSE)
  commons <- read_json(paste0(dir, "/commons.json"))
  repos <- Filter(length, commons$repositories)
  if (!length(repos)) repos <- readLines(paste0(dir, "/scripts/repos.txt"))
  if (!length(repos)) cli_abort("no repositories are listed in {.file commons.json}.")
  repos <- gsub("^[\"']+|['\"]+$|^.*github\\.com/", "", repos)
  su <- !grepl("/", repos, fixed = TRUE)
  if (any(su)) {
    repos <- repos[su]
    cli_abort("repo{?s are/ is} missing a username prefix: {.files {repos}}")
  }
  repos <- sub("^([^/]+/[^/#@]+)[^/]*$", "\\1", repos)
  if (!identical(unlist(commons$repositories, use.names = FALSE), repos)) {
    commons$repositories <- repos
    write_json(commons, paste0(dir, "/commons.json"), pretty = TRUE, auto_unbox = TRUE)
  }
  writeLines(repos, paste0(dir, "/scripts/repos.txt"))
  if (only_new) {
    repos <- repos[!file.exists(paste0(dir, "/repos/", sub("^.*/", "", repos)))]
    if (!length(repos)) {
      if (verbose) cli_alert_success("no new repositories")
      return(invisible(repos))
    }
  }
  updated <- dist_updated <- logical(length(repos))
  wd <- getwd()
  on.exit(setwd(wd))
  repo_dir <- paste0(normalizePath(paste0(dir, "/repos/"), "/", FALSE), "/")
  dir.create(repo_dir, FALSE, TRUE)
  setwd(repo_dir)
  method <- if (clone_method == "ssh") "git@github.com:" else "https://github.com/"
  if (include_distributions) dir.create("../cache", FALSE)
  manifest_file <- paste0(dir, "/manifest/repos.json")
  repo_manifest <- if (file.exists(manifest_file)) read_json(manifest_file) else list()
  for (i in seq_along(repos)) {
    r <- repos[[i]]
    rn <- sub("^.*/", "", r)
    cr <- paste0(repo_dir, rn, "/")
    if (!rescan_only) {
      change_dir <- dir.exists(rn)
      if (verbose) cli_alert_info(paste(if (change_dir) "pulling" else "cloning", rn))
      if (change_dir) setwd(cr)
      s <- tryCatch(if (change_dir) {
        if (reset_repos) {
          system2("git", "fetch", stdout = TRUE)
          system2("git", "reset --hard FETCH_HEAD", stdout = TRUE)
        } else {
          system2("git", "pull", stdout = TRUE)
        }
      } else {
        system2("git", c("clone", paste0(method, r, ".git")), stdout = TRUE)
      }, error = function(e) e$message)
      if (change_dir) setwd(repo_dir)
      if (length(s) != 1 || s != "Already up to date.") {
        if (!is.null(attr(s, "status"))) {
          cli_alert_warning(c(
            x = paste0("failed to retrieve ", r, ": ", paste(s, collapse = " "))
          ))
        } else {
          updated[i] <- TRUE
        }
      } else if (!length(list.files(rn))) system2("rm", c("-rf", rn))
    }
    files <- NULL
    if (use_manifest && file.exists(paste0(cr, "manifest.json"))) {
      files <- paste0(cr, read_json(paste0(cr, "manifest.json"), simplifyVector = TRUE)$data$path)
      files <- files[file.exists(files)]
    }
    if (!length(files)) {
      files <- list.files(
        cr, "\\.(?:csv|tsv|txt|dat|rda|rdata)(?:\\.[gbx]z2?)?$",
        full.names = TRUE, recursive = TRUE, ignore.case = TRUE
      )
    }
    for (f in files) {
      repo_manifest[[r]]$files[[basename(f)]] <- list(
        location = dirname(sub(cr, "", f, fixed = TRUE)),
        date = format(file.mtime(f), "%Y-%m-%dT%H:%M:%SZ"),
        size = file.size(f),
        sha = system2("git", c("hash-object", shQuote(f)), stdout = TRUE),
        md5 = md5sum(f)[[1]]
      )
    }
    doi <- repo_manifest[[r]]$distributions$dataverse$doi
    if (include_distributions && !is.null(doi)) {
      if (verbose) {
        ul <- cli_ul()
        iul <- cli_ul()
        cli_li("including Dataverse distribution for {.emph {doi}}")
      }
      meta_file <- paste0("../cache/", rn, "/dataverse_metadata.json")
      meta <- if (!refresh_distributions && file.exists(meta_file)) {
        read_json(meta_file)
      } else {
        tryCatch(download_dataverse_info(doi, refresh = refresh_distributions), error = function(e) NULL)
      }
      if (is.null(meta)) {
        if (verbose) {
          cli_li(col_red("failed to download Dataverse metadata for {.emph {doi}}"))
          cli_end(iul)
          cli_end(ul)
        }
      } else {
        if (is.null(meta$latestVersion)) meta$latestVersion <- list(files = meta$files)
        dir.create(paste0("../cache/", rn), FALSE)
        write_json(meta, meta_file, pretty = TRUE, auto_unbox = TRUE)
        repo_manifest[[r]]$distributions$dataverse$id <- meta$datasetId
        repo_manifest[[r]]$distributions$dataverse$server <- meta$server
        repo_manifest[[r]]$distributions$dataverse$files <- list()
        if (length(meta$latestVersion$files)) {
          for (f in meta$latestVersion$files) {
            existing <- paste0("../cache/", rn, "/", f$dataFile$filename)
            if (file.exists(existing)) {
              if (verbose) cli_li("checking existing version of {.file {f$dataFile$filename}}")
              if (md5sum(existing) != f$dataFile$md5) unlink(existing)
            }
            if (!file.exists(existing)) {
              if (verbose) cli_li("downloading {.file {f$dataFile$filename}}")
              res <- tryCatch(download_dataverse_data(
                doi, paste0("../cache/", rn),
                files = f$label, load = FALSE, decompress = FALSE
              ), error = function(e) NULL)
              if (is.null(res)) {
                if (verbose) cli_li(col_red("failed to download {.file {f$dataFile$filename}}"))
              } else {
                dist_updated[i] <- TRUE
              }
            }
            if (file.exists(existing)) {
              repo_manifest[[r]]$distributions$dataverse$files[[basename(existing)]] <- list(
                id = f$dataFile$id,
                date = paste0(f$dataFile$creationDate, "T00:00:00Z"),
                size = file.size(existing),
                md5 = md5sum(existing)[[1]]
              )
            }
          }
        }
      }
      if (verbose) {
        cli_end(iul)
        cli_end(ul)
      }
    }
  }
  if (verbose) {
    if (any(updated)) {
      updated_repos <- repos[updated]
      cli_alert_success("updated data repositor{?ies/y}: {.file {updated_repos}}")
    }
    if (any(dist_updated)) {
      updated_distributions <- repos[dist_updated]
      cli_alert_success("updated distributed file{?s} in: {.file {updated_distributions}}")
    }
    if (!any(updated | dist_updated)) {
      cli_alert_success("all data repositories are up to date")
    }
  }
  if (length(repo_manifest)) {
    su <- names(repo_manifest) %in% repos
    if (any(su)) {
      write_json(repo_manifest[su], manifest_file, pretty = TRUE, auto_unbox = TRUE)
    } else {
      cli_warn("no repos were found in the existing repo manifest")
    }
  }
  init_datacommons(dir, refresh_after = FALSE, verbose = FALSE)
  invisible(repos[updated | dist_updated])
}
