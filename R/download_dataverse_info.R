#' @rdname download_dataverse_data
#' @return \code{download_dataverse_info}: A list with the dataset's metadata.
#' @export

download_dataverse_info <- function(id, server = NULL, refresh = FALSE, verbose = FALSE) {
  if (missing(id)) cli_abort("an id must be specified")
  if (!grepl("doi", tolower(id), fixed = TRUE) && grepl("^[^/]+/[^/]+$", id)) {
    repo <- tryCatch(read_json(paste0("https://api.github.com/repos/", id)), error = function(e) NULL)
    if (!is.null(repo$default_branch)) {
      if (verbose) cli_alert_info("getting ID from Github repository {id}")
      tryCatch(
        load(file(paste0(
          "https://raw.githubusercontent.com/", id, "/", repo$default_branch, "/R/sysdata.rda"
        ))),
        error = function(e) NULL
      )
      if (!exists("dataset_doi")) {
        dataset_doi <- tryCatch(
          readLines(paste0(
            "https://raw.githubusercontent.com/", id, "/", repo$default_branch, "/data/dataset_doi"
          ), warn = FALSE),
          error = function(e) NULL
        )
      }
      if (length(dataset_doi)) {
        id <- dataset_doi[[1]]
      } else {
        cli_abort(paste0(
          "{.arg id} points to a Github repository that does not have an appropriate",
          "{.file /data/dataset_doi} file"
        ))
      }
    }
  }
  id <- sub("^(http|doi)[^\\d]*", "", id, perl = TRUE)
  temp <- paste0(tempdir(), "/", gsub("\\W", "", id), ".json")
  if (refresh) unlink(temp)
  if (!file.exists(temp)) {
    if (is.null(server)) {
      server <- if (Sys.which("curl") != "") {
        if (verbose) cli_alert_info("getting server from DOI ({id}) redirect")
        tryCatch(
          {
            url <- gsub("<[^>]*>", "", system2("curl", paste0("https://doi.org/", id), stdout = TRUE)[5])
            if (grepl("^http", url)) gsub("^https?://|/citation.*$", "", url) else NA
          },
          error = function(e) {
            if (verbose) cli_alert_info("failed to get server from DOI ({id}) redirect")
            NA
          }
        )
      } else {
        NA
      }
      if (is.na(server)) {
        if (verbose) cli_alert_info("looking for server in fall-backs")
        server <- Sys.getenv("DATAVERSE_SERVER")
        if (server == "") {
          server <- getOption("dataverse.server")
          if (is.null(server)) server <- "dataverse.lib.virginia.edu"
        }
      }
    }
    if (!grepl("://", server, fixed = TRUE)) server <- paste0("https://", server)
    server <- sub("/api/.*$", "/", gsub("//+$", "/", paste0(server, "/")))
  }
  res <- tryCatch(
    {
      if (!file.exists(temp)) {
        if (verbose) cli_alert_info("downloading dataset metadata for {id} from {server}")
        res <- read_json(paste0(server, "api/datasets/:persistentId?persistentId=doi:", id))$data
        res$server <- server
        write_json(res, temp, auto_unbox = TRUE)
        res
      } else {
        if (verbose) cli_alert_info("reading in existing metadata for {id}")
        read_json(temp)
      }
    },
    error = function(e) NULL
  )
  if (is.null(res)) {
    if (file.exists(temp)) {
      cli_abort(cli_bullets(c(
        x = "downloaded the metadata, but failed to read it in",
        i = paste0("check {.file ", temp, "}")
      )))
    } else {
      cli_abort(cli_bullets(c(
        x = "failed to retrive info",
        i = paste0(
          "check that the dataset exists: {.url ", server, "dataset.xhtml?persistentId=doi:", id, "}"
        )
      )))
    }
  }
  res
}
