#' Download Dataverse Dataset Files
#'
#' Download one or all files in a Dataverse dataset.
#'
#' @param id The dataset's persistent ID (e.g., \code{"doi:10.18130/V3/SWK71R"}), or a GitHub repository
#' (\code{"username/repo"}) with a \code{R/sysdata.rda} file containing a \code{dataset_doi}.
#' @param outdir Directory in which to save files; defaults to a temporary directory.
#' @param files Names (full or partial) of files to download, or a number or vector of numbers
#' identifying file by index as listed on Dataverse; downloads all files in a dataset if not specified.
#' @param version Version of the dataset to download. Specifying this will download all files,
#' even if only a selection is requested.
#' @param server Dataverse server; tries to get this from the DOI redirect, but falls back on
#' \code{Sys.getenv("DATAVERSE_SERVER")}, then \code{getOption("dataverse.server")}, then
#' \code{"dataverse.lib.virginia.edu"}.
#' @param load Logical; if \code{FALSE}, files will be downloaded but not loaded.
#' @param refresh Logical; if \code{TRUE}, downloads and replaces any existing files.
#' @param verbose Logical; if \code{TRUE}, prints status updates and warnings.
#' @examples
#' \dontrun{
#' metadata <- download_dataverse_info("doi:10.18130/V3/SWK71R", verbose = TRUE)
#' data <- download_dataverse_data("doi:10.18130/V3/SWK71R", verbose = TRUE)
#' }
#' @return \code{download_dataverse_data}: If \code{load} is \code{TRUE}, an invisible list with
#' an entry for each data file if there are multiple files, or the loaded data file if a single file
#' is requested. Tabular data files are loaded as \code{data.table}s. If \code{load} is \code{FALSE},
#' a list with the dataset's metadata.
#' @export

download_dataverse_data <- function(id, outdir = tempdir(), files = NULL, version = ":latest",
                                    server = NULL, load = TRUE, refresh = FALSE, verbose = FALSE) {
  if (missing(id)) cli_abort("an id must be specified")
  meta <- download_dataverse_info(id, server, refresh)
  fs <- vapply(meta$latestVersion$files, function(m) m$dataFile$filename, "")
  which_files <- if (!is.null(files)) {
    if (is.numeric(files)) {
      files[files <= length(fs)]
    } else {
      grep(paste0(
        "(?:", paste(gsub(".", "\\\\.", files, fixed = TRUE), collapse = "|"), ")"
      ), fs, TRUE)
    }
  } else {
    seq_along(fs)
  }
  if (!length(which_files)) {
    cli_abort(cli_bullets(c(
      x = "{.arg files} could not be matched to available files",
      i = paste0("check {.url ", meta$persistentUrl, "}")
    )))
  }
  outdir <- paste0(normalizePath(outdir, "/", FALSE), "/")
  dir.create(outdir, FALSE, TRUE)
  data <- list()
  ffsx <- paste0(outdir, fs)
  ffs <- sub("\\.(?:xz|bz|gz)$", "", ffsx)
  success <- logical(length(fs))
  if (refresh) unlink(c(ffsx, ffs))
  if (length(which_files) == length(fs) || !missing(version)) {
    zf <- paste0(outdir, gsub("\\W", "", meta$latestVersion$datasetPersistentId), ".zip")
    if (verbose) cli_alert_info("downloading dataset: {meta$latestVersion$datasetPersistentId}")
    tryCatch(
      download.file(paste0(
        meta$server, "api/access/dataset/:persistentId/versions/", version, "?persistentId=",
        meta$latestVersion$datasetPersistentId
      ), zf, quiet = TRUE, mode = "wb"),
      error = function(e) NULL
    )
    if (file.exists(zf)) {
      unzip(zf, exdir = sub("/$", "", outdir))
      unlink(zf)
    } else if (verbose) cli_alert_info("failed to download dataset {meta$id}; trying individual files...")
  }
  for (i in which_files) {
    m <- meta$latestVersion$files[[i]]
    meta$latestVersion$files[[i]]$local <- ffs[i]
    if (!file.exists(ffs[i]) && !file.exists(ffsx[i])) {
      if (verbose) cli_alert_info("downloading file: {.file {m$label}}")
      tryCatch(
        download.file(
          paste0(meta$server, "api/access/datafile/", m$dataFile$id), ffsx[i],
          quiet = TRUE, mode = "wb"
        ),
        error = function(e) NULL
      )
      if (verbose && !file.exists(ffsx[i])) cli_alert_info("failed to download file: {.file {m$label}}")
    }
    if (file.exists(ffsx[i])) {
      if (verbose && m$dataFile$md5 != md5sum(ffsx[i])) {
        cli_warn("file was downloaded but its checksum did not match: {.file {ffsx[i]}}")
      }
      if (grepl("(?:xz|bz|gz)$", ffsx[i])) {
        if (verbose) cli_alert_info("decompressing file: {.file {ffsx[i]}}")
        system2(
          c(xz = "xz", bz = "bunzip2", gz = "gzip")[substring(ffsx[i], nchar(ffsx[i]) - 1)],
          c("-df", shQuote(ffsx[i]))
        )
      }
    }
    if (load && file.exists(ffs[i])) {
      if (verbose) cli_alert_info("loading file: {.file {ffs[i]}}")
      fn <- sub("\\..*", "", m$label)
      data[[fn]] <- tryCatch(
        (if (grepl("\\.json$", ffs[i])) read_json else fread)(ffs[i]),
        error = function(e) NULL
      )
      if (verbose && is.null(data[[fn]])) {
        cli_warn("file was downloaded but failed to load: {.file {ffs[i]}}")
      }
    }
  }
  ffs <- ffs[which_files]
  if (verbose && any(!file.exists(ffs))) {
    cli_warn("failed to download file{?s}: {.file {ffs[!file.exists(ffs)]}}")
  }
  invisible(if (load) if (length(data) == 1) data[[1]] else data else meta)
}
