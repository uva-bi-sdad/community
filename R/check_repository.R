#' Check Data Repositories
#'
#' Performs a series of checks to see if data in a given repository can be ingested by a datacommons project.
#'
#' @param dir Root directory of the data repository.
#' @param search_pattern Regular expression used to search for data files.
#' @param value Name of the column containing variable values.
#' @param value_name Name of the column containing variable names.
#' @param value_type Name of the column indicating the type of each value.
#' @param id Column name of IDs that uniquely identify entities.
#' @param time Column name of the variable representing time.
#' @param dataset Column name used to separate data into sets (such as by region).
#' @param entity_info A vector of variable names to go into making \code{entity_info.json}.
#' @param check_values Logical; if \code{FALSE}, will skip value-based checks
#' (since these are loose heuristics and can be intensive on large files).
#' @param attempt_repair Logical; if \code{TRUE}, will attempt to fix most warnings in data files.
#' Use with caution, as this will often remove rows (given \code{NA}s) and rewrite the file.
#' @examples
#' \dontrun{
#' # from a data repository
#' check_repository()
#'
#' # to automatically fix most warnings
#' check_repository(attempt_repair = TRUE)
#' }
#' @return An invisible list of check results, in the form of paths to files and/or measure name.
#' These may include \strong{general} entries:
#' \itemize{
#'   \item \strong{\code{info}} (always): All measurement information (\code{measure_info.json}) files found.
#'   \item \strong{\code{data}} (always): All data files found.
#'   \item \strong{\code{not_considered}}: Subset of data files that do not contain the minimal
#'     columns (\code{id}, \code{value}, and \code{value_type}), and so are not checked further.
#' }
#' or those relating to issues with \strong{measure information} files:
#' \itemize{
#'   \item \strong{\code{info_malformed}}: Files that are not in the expected format (a single object with
#'     named entries for each measure), but can be converted automatically.
#'   \item \strong{\code{info_incomplete}}: Measure entries that are missing some of the required fields.
#'   \item \strong{\code{info_invalid}}: Files that could not be read in (probably because they do not contain valid JSON).
#' }
#' or relating to data files with \strong{warnings}:
#' \itemize{
#'   \item \strong{\code{warn_compressed}}: Files that do not have compression extensions
#'     (\code{.gz}, \code{.bz2}, or \code{.xz}).
#'   \item \strong{\code{warn_blank_colnames}}: Files with blank column names (often due to saving files with row names).
#'   \item \strong{\code{warn_value_nas}}: Files that have \code{NA}s in their \code{value} columns; \code{NA}s here
#'     are redundant with the tall format, and so, should be removed.
#'   \item \strong{\code{warn_double_ints}}: Variable names that have an \code{int} type, but with values that have remainders.
#'   \item \strong{\code{warn_small_percents}}: Variable names that have a \code{percent} type, but that are all under \code{1}
#'     (which are assumed to be raw proportions).
#'   \item \strong{\code{warn_small_values}}: Variable names with many values (over 40%) that are under \code{.00001}, and
#'     no values under \code{0} or over \code{1}. These values should be scaled in some way to be displayed reliably.
#'   \item \strong{\code{warn_value_name_nas}}: Files that have \code{NA}s in their \code{name} column.
#'   \item \strong{\code{warn_value_type_nas}}: Files that have \code{NA}s in their \code{name} column.
#'   \item \strong{\code{warn_entity_info_nas}}: Files that have \code{NA}s in any of their \code{entity_info} columns.
#'   \item \strong{\code{warn_dataset_nas}}: Files that have \code{NA}s in their \code{dataset} column.
#'   \item \strong{\code{warn_time_nas}}: Files that have \code{NA}s in their \code{time} column.
#'   \item \strong{\code{warn_id_nas}}: Files that have \code{NA}s in their \code{id} column.
#'   \item \strong{\code{warn_scientific}}: Files with IDs that appear to have scientific notation (e.g., \code{1e+5});
#'     likely introduced when the ID column was converted from numbers to characters -- IDs should always be saved as characters.
#'   \item \strong{\code{warn_bg_agg}}: Files with IDs that appear to be census block group GEOIDs,
#'     that do not include their tract parents (i.e., IDs consisting of 12 digits, and there are no IDs consisting of
#'     their first 11 digits). These are automatically aggregated by \code{\link{site_build}}, but they should
#'     be manually aggregated.
#'   \item \strong{\code{warn_tr_agg}}: Files with IDs that appear to be census tract GEOIDs,
#'     that do not include their county parents (i.e., IDs consisting of 11 digits, and there are no IDs consisting of
#'     their first 5 digits). These are automatically aggregated by \code{\link{site_build}}, but they should
#'     be manually aggregated.
#'   \item \strong{\code{warn_missing_info}}: Measures in files that do not have a corresponding \code{measure_info.json}
#'     entry. Sometimes this happens because the entry includes a prefix that cannot be derived from the file name
#'     (which is the part after a year, such as \code{category} from \code{set_geo_2015_category.csv.xz}).
#'     It is recommended that entries not include prefixes, and that measure names be specific
#'     (e.g., \code{category_count} rather than \code{count} with a \code{category:count} entry).
#' }
#' or relating to data files with \strong{failures}:
#' \itemize{
#'   \item \strong{\code{fail_read}}: Files that could not be read in.
#'   \item \strong{\code{fail_rows}}: Files containing no rows.
#'   \item \strong{\code{fail_value_type}}: Files with no \code{value_type} column.
#'   \item \strong{\code{fail_time}}: Files with no \code{time} column.
#'   \item \strong{\code{fail_dataset}}: Files with no \code{dataset} column.
#'   \item \strong{\code{fail_entity_info}}: Files with no \code{entity_info} columns.
#'   \item \strong{\code{fail_idlen_county}}: Files with "county" \code{dataset}s with corresponding IDs
#'     that are not consistently 5 characters long.
#'   \item \strong{\code{fail_idlen_tract}}: Files with "tract" \code{dataset}s with corresponding IDs
#'     that are not consistently 11 characters long.
#'   \item \strong{\code{fail_idlen_block_group}}: Files with "block group" \code{dataset}s with corresponding IDs
#'     that are not consistently 12 characters long.
#' }
#' @export

check_repository <- function(dir = ".", search_pattern = "\\.csv(?:\\.[gbx]z2?)?$", value = "value", value_name = "measure",
                             value_type = "measure_type", id = "geoid", time = "year", dataset = "region_type",
                             entity_info = c("region_type", "region_name"), check_values = TRUE, attempt_repair = FALSE) {
  if (!dir.exists(dir)) cli_abort("{.path {dir}} does not exist")
  project_check <- check_template("repository", dir = dir)
  if (project_check$exists) {
    if (length(project_check$incomplete)) {
      cli_alert_warning("please update template content in {.file {project_check$incomplete}}")
    }
  }
  files <- list.files(dir, search_pattern, recursive = TRUE, full.names = TRUE)
  files <- files[!grepl("[/\\](?:docs|code|working|original)[/\\]", files, TRUE)]
  if (!length(files)) cli_abort("no files found")
  i <- 0
  cli_h1("measure info")
  meta <- list()
  info_files <- list.files(dir, "^measure_info[^.]*\\.json$", full.names = TRUE, recursive = TRUE)
  results <- list(data = files, info = info_files)
  required_fields <- c("measure", "category", "type", "short_name", "short_description")
  cli_progress_step(
    "checking {i} of {length(info_files)} measure info files",
    "checked {length(info_files)} measure info files",
    spinner = TRUE
  )
  all_issues <- list()
  for (f in info_files) {
    m <- tryCatch(read_json(f), error = function(e) NULL)
    if (is.null(m)) cli_abort("measure info is malformed: {.file {f}}")
    i <- i + 1
    cli_progress_update()
    issues <- NULL
    if (!is.null(m$type) && !is.null(m$measure)) {
      issues <- "recoverably malformed (should be an object with named entries for each measure)"
      results$info_malformed <- c(results$info_malformed, f)
      m <- list(m)
      names(m) <- m[[1]]$measure
    }
    for (n in names(m)) {
      if (!grepl("^_", n)) {
        cm <- Filter(function(e) length(e) && e != "", m[[n]][required_fields])
        mf <- required_fields[!required_fields %in% names(cm)]
        if (length(mf)) {
          results$info_incomplete[[f]] <- c(results$info_incomplete[[f]], m)
          issues <- c(issues, paste0(
            "{.strong {.field ", n, "}} is missing ", if (length(mf) > 1) "fields" else "a field", ": ",
            paste(paste0("{.pkg ", mf, "}"), collapse = ", ")
          ))
        }
      }
    }
    if (length(issues)) {
      names(issues) <- rep(">", length(issues))
      all_issues[[f]] <- issues
    }
    if (length(m)) {
      meta <- c(meta, m)
    } else {
      results$info_invalid <- c(results$info_invalid, f)
    }
  }
  cli_progress_done()
  if (!length(meta)) cli_alert_danger("no valid measure info")
  if (length(all_issues)) {
    cli_h2("{length(all_issues)} measure info file{? has/s have} issues")
    for (f in names(all_issues)) {
      cli_alert_danger("{.file {f}}:")
      cli_bullets(all_issues[[f]])
    }
  }

  i <- 0
  cli_h1("data")
  cli_progress_step(
    "checking {i} of {length(files)} data file{?/s}", "checked {length(files)} data file{?/s}",
    spinner = TRUE
  )
  adjustments <- data.frame(
    min = c(1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4),
    factor = c(1e9, 1e8, 1e7, 1e6, 1e5, 1e4),
    type = paste("per", c("1b", "100m", "1m", "100k", "10k", "1k"))
  )
  census_geolayers <- c(county = 5, tract = 11, "block group" = 12)
  required <- c(id, value_name, value)
  vars <- unique(c(required, value_type, time, dataset, entity_info))
  entity_info <- entity_info[!entity_info %in% c(required, time, dataset)]
  files_short <- sub("^/", "", sub(dir, "", files, fixed = TRUE))
  for (i in seq_along(files)) {
    cli_progress_update()
    path <- files[[i]]
    f <- files_short[[i]]
    sep <- if (grepl(".csv", path, fixed = TRUE)) "," else "\t"
    cols <- tryCatch(scan(path, "", sep = sep, nlines = 1, quiet = TRUE), error = function(e) NULL)
    lcols <- tolower(cols)
    su <- !cols %in% vars & lcols %in% vars
    if (any(su)) cols[su] <- lcols[su]
    if (all(required %in% cols)) {
      d <- if (is.null(cols)) {
        NULL
      } else {
        tryCatch(as.data.frame(read_delim_arrow(
          gzfile(path), sep,
          skip = 1, col_names = cols,
          col_types = paste(c("c", "n")[as.integer(cols %in% c(value, time)) + 1L], collapse = "")
        )), error = function(e) NULL)
      }
      if (is.null(d)) {
        results$fail_read <- c(results$fail_read, f)
      } else {
        if (nrow(d)) {
          ck_values <- check_values && value_type %in% cols
          if (missing(check_values) && nrow(d) > 5e6) {
            cli_alert_info(paste(
              "skipping value checks for {.field {f}} due to size ({prettyNum(nrow(d), big.mark = ',')} rows);",
              "set {.arg check_values} to {.pkg TRUE} to force checks"
            ))
            ck_values <- FALSE
          }
          d[[id]] <- as.character(d[[id]])
          if (!time %in% cols) results$fail_time <- c(results$fail_time, f)
          if (!value_type %in% cols) results$fail_value_type <- c(results$fail_value_type, f)
          all_entity_info <- all(entity_info %in% cols)
          if (!all_entity_info) results$fail_entity_info <- c(results$fail_entity_info, f)

          if (attempt_repair) {
            repairs <- NULL
            if (!grepl("\\.[bgx]z2?$", f)) repairs <- "warn_compression"
            if (any(cols == "")) {
              repairs <- c(repairs, "warn_blank_colnames")
              d <- d[, cols != ""]
            }
            if (anyNA(d[[value]])) {
              d <- d[!is.na(d[[value]]), ]
              repairs <- c(repairs, "warn_value_nas")
            }
            su <- grep("\\de[+-]?\\d", d[[id]])
            if (length(su)) {
              d[[id]][su] <- gsub("^\\s+|\\s+$", "", format(as.numeric(d[[id]][su]), scientific = FALSE))
              repairs <- c(repairs, "warn_scientific")
            }
            if (nrow(d)) {
              if (anyNA(d[[id]])) {
                repairs <- c(repairs, "warn_id_nas")
                d <- d[!is.na(d[[id]]), ]
              }
            }
            if (nrow(d)) {
              if (anyNA(d[[value_name]])) {
                repairs <- c(repairs, "warn_value_name_nas")
                d <- d[!is.na(d[[value_name]]), ]
              }
            }
            if (nrow(d) && dataset %in% cols) {
              if (anyNA(d[[dataset]])) {
                repairs <- c(repairs, "warn_dataset_nas")
                d <- d[!is.na(d[[dataset]]), ]
              }
            }
            if (nrow(d) && time %in% cols) {
              if (anyNA(d[[time]])) {
                repairs <- c(repairs, "warn_time_nas")
                d <- d[!is.na(d[[time]]), ]
              }
            }
            if (nrow(d) && all_entity_info) {
              if (anyNA(d[, entity_info])) {
                repairs <- c(repairs, "warn_entity_info_nas")
                d <- d[rowSums(is.na(d[, entity_info, drop = FALSE])) == 0, ]
              }
            }
            if (nrow(d) && value_type %in% cols) {
              if (anyNA(d[[value_type]])) {
                repairs <- c(repairs, "warn_value_type_nas")
                d <- d[!is.na(d[[value_type]]), ]
              }
              if (ck_values && nrow(d)) {
                md <- split(d, d[[value_name]])
                for (m in names(md)) {
                  type <- md[[m]][[value_type]][1]
                  if (type == "percent") {
                    if (!any(md[[m]][[value]] > 1)) {
                      d[[value]][d[[value_name]] == m] <- d[[value]][d[[value_name]] == m] * 100
                      repairs <- c(repairs, "warn_small_percents")
                    }
                  } else if (grepl("^int", type)) {
                    if (any(md[[m]][[value]] %% 1 != 0)) {
                      d[[value_type]][d[[value_name]] == m] <- "numeric"
                      repairs <- c(repairs, "warn_double_ints")
                    }
                  } else if (!grepl("^per[ 0-9]", type, TRUE)) {
                    mm <- min(md[[m]][[value]])
                    if (mm >= 0 && max(md[[m]][[value]]) < 1 && mean(md[[m]][[value]] > 0 & md[[m]][[value]] < 1e-4) > .4) {
                      adj <- which(mm < adjustments$min)[1]
                      if (is.na(adj)) adj <- 1
                      d[[value]][d[[value_name]] == m] <- d[[value]][d[[value_name]] == m] * adjustments$factor[adj]
                      d[[value_type]][d[[value_name]] == m] <- adjustments$type[adj]
                      repairs <- c(repairs, "warn_small_values")
                    }
                  }
                }
              }
            }
            if (length(repairs)) {
              if (!nrow(d)) {
                cli_alert_danger("{.strong attempting repairs ({repairs}) removed all rows of {.file {f}}}")
              } else {
                tf <- sub("\\..+(?:\\.[bgx]z2?)?$", ".csv.xz", path)
                w <- tryCatch(
                  {
                    write.csv(d, xzfile(tf), row.names = FALSE)
                    TRUE
                  },
                  error = function(e) NULL
                )
                if (is.null(w)) {
                  cli_alert_danger("failed to write repairs ({.field {repairs}}) to {.file {f}}")
                } else {
                  if (path != tf) {
                    unlink(path)
                  }
                  cli_alert_info("wrote repairs ({.field {repairs}}) to {.file {tf}}")
                }
              }
            }
          } else {
            if (!grepl("[bgx]z2?$", f)) results$warn_compressed <- c(results$warn_compressed, f)
            if (any(cols == "")) results$warn_blank_colnames <- c(results$warn_blank_colnames, f)
            if (anyNA(d[[value]])) {
              results$warn_value_nas <- c(results$warn_value_nas, f)
              if (ck_values) d[[value]][is.na(d[[value]])] <- 0
            }
            if (anyNA(d[[id]])) {
              results$warn_id_nas <- c(results$warn_id_nas, f)
              d[[id]][is.na(d[[id]])] <- "NA"
            }
            if (any(grepl("\\de[+-]\\d", d[[id]]))) results$warn_scientific <- c(results$warn_scientific, f)
            if (anyNA(d[[value_name]])) {
              results$warn_value_name_nas <- c(results$warn_value_name_nas, f)
              d[[value_name]][is.na(d[[value_name]])] <- "NA"
            }
            if (value_type %in% cols && anyNA(d[[value_type]])) {
              results$warn_value_type_nas <- c(results$warn_value_type_nas, f)
              d[[value_type]][is.na(d[[value_type]])] <- "NA"
            }
            if (dataset %in% cols && anyNA(d[[dataset]])) {
              results$warn_dataset_nas <- c(results$warn_dataset_nas, f)
              d[[dataset]][is.na(d[[dataset]])] <- "NA"
            }
            if (all_entity_info && anyNA(d[, entity_info])) results$warn_entity_info_nas <- c(results$warn_entity_info_nas, f)
            if (time %in% cols && anyNA(d[[time]])) {
              results$warn_time_nas <- c(results$warn_time_nas, f)
              d[[time]][is.na(d[[time]])] <- "NA"
            }
          }

          if (nrow(d)) {
            if (dataset %in% cols) {
              for (l in names(census_geolayers)) {
                if (l %in% d[[dataset]]) {
                  su <- d[[dataset]] == l
                  n_match <- sum(nchar(d[[id]][su]) == census_geolayers[[l]])
                  if (n_match && n_match < sum(su)) {
                    e <- paste0("fail_idlen_", sub(" ", "", l, fixed = TRUE))
                    results[[e]] <- c(results[[e]], f)
                  }
                }
              }
            } else {
              results$fail_dataset <- c(results$fail_dataset, f)
            }

            measures <- unique(d[[value_name]])
            measures <- measures[measures != "NA"]
            su <- !measures %in% names(meta)
            if (any(su)) su[su] <- !make_full_name(f, measures[su]) %in% names(meta)
            if (any(su)) results$warn_missing_info[[f]] <- c(results$warn_missing_info[[f]], measures[su])

            id_chars <- nchar(d[[id]])
            su <- which(id_chars == 12)
            if (length(su)) {
              su <- su[grep("[^0-9]", d[[id]][su], invert = TRUE)]
              if (length(su) && any(!unique(substring(d[[id]][su], 1, 11)) %in% d[[id]])) {
                results$warn_bg_agg <- c(results$warn_bg_agg, f)
              }
            }
            su <- which(id_chars == 11)
            if (length(su)) {
              su <- su[grep("[^0-9]", d[[id]][su], invert = TRUE)]
              if (length(su) && any(!unique(substring(d[[id]][su], 1, 5)) %in% d[[id]])) {
                results$warn_tr_agg <- c(results$warn_tr_agg, f)
              }
            }

            if (ck_values) {
              md <- split(d, d[[value_name]])
              for (m in names(md)) {
                if (m != "NA") {
                  type <- md[[m]][[value_type]][1]
                  if (type == "percent") {
                    if (!any(md[[m]][[value]] > 1)) {
                      results$warn_small_percents[[f]] <- c(results$warn_small_percents[[f]], m)
                    }
                  } else if (grepl("^int", type)) {
                    if (any(md[[m]][[value]] %% 1 != 0)) {
                      results$warn_double_ints[[f]] <- c(results$warn_double_ints[[f]], m)
                    }
                  } else if (!grepl("^per[ 0-9]", type, TRUE)) {
                    mm <- min(md[[m]][[value]])
                    if (mm >= 0 && max(md[[m]][[value]]) < 1 && mean(md[[m]][[value]] > 0 & md[[m]][[value]] < 1e-4) > .4) {
                      results$warn_small_values[[f]] <- c(results$warn_small_values[[f]], m)
                    }
                  }
                }
              }
            }
          }
        } else {
          results$fail_rows <- c(results$fail_rows, f)
        }
      }
    } else {
      results$not_considered <- c(results$not_considered, f)
    }
  }
  cli_progress_done()

  long_paths <- files_short[nchar(files_short) > 140]
  n_long_paths <- length(long_paths)
  if (n_long_paths) {
    cli_alert_warning("{.strong {n_long_paths} {?path is/paths are} very long (over 140 character):}")
    cli_bullets(structure(
      paste0("(", nchar(long_paths), ") {.field ", long_paths, "}"),
      names = rep(">", n_long_paths)
    ))
  }

  res_summary <- c(FAIL = 0, WARN = 0, SKIP = 0, PASS = 0)
  if (length(results$not_considered)) {
    res_summary["SKIP"] <- length(results$not_considered)
    cli_alert_info(paste(
      '{.strong skipped {res_summary["SKIP"]} file{?/s} because {?it does/they do}',
      "not include all base columns ({.pkg {required}}):}"
    ))
    cli_bullets(structure(
      paste0("{.field ", results$not_considered, "}"),
      names = rep(">", length(results$not_considered))
    ))
  }

  warnings <- unique(unlist(grep("^warn_", names(results), value = TRUE), function(w) {
    if (is.list(results[[w]])) names(results[[w]]) else results[[w]]
  }, use.names = FALSE))
  n_warn <- length(warnings)
  if (n_warn) {
    res_summary["WARN"] <- n_warn
    cli_h2("{n_warn} file{? has/s have} warnings")
    sections <- list(
      warn_compressed = "not compressed:",
      warn_blank_colnames = "contains blank column names:",
      warn_value_nas = "{.pkg {value}} column contains NAs (which are redundant):",
      warn_id_nas = "{.pkg {id}} column contains NAs:",
      warn_value_name_nas = "{.pkg {value_name}} column contains NAs:",
      warn_value_type_nas = "{.pkg {value_type}} column contains NAs:",
      warn_dataset_nas = "{.pkg {dataset}} column contains NAs:",
      warn_time_nas = "{.pkg {time}} column contains NAs:",
      warn_entity_info_nas = "entity information column{?/s} ({.pkg {entity_info}}) contain{?s/} NAs:",
      warn_bg_agg = "may have block groups that have not been aggregated to tracts:",
      warn_tr_agg = "may have tracts that have not been aggregated to counties:"
    )
    for (s in names(sections)) {
      if (length(results[[s]])) {
        cli_alert_warning(paste0("{.strong ", sections[[s]], "}"))
        cli_bullets(structure(
          paste0("{.field ", results[[s]], "}"),
          names = rep(">", length(results[[s]]))
        ))
      }
    }
    sections <- list(
      warn_missing_info = "missing measure info entries:",
      warn_small_percents = "no values with a {.pkg percent} type are over 1",
      warn_double_ints = "values with an {.pkg int*} type have decimals",
      warn_small_values = "non-zero values are very small (under .00001) -- they will display as 0s"
    )
    for (s in names(sections)) {
      if (length(results[[s]])) {
        cli_alert_warning(paste0("{.strong ", sections[[s]], "}"))
        if (s == "warn_missing_info") meta_base <- sub("^[^:]*:", "", names(meta))
        missing_info <- unlist(lapply(
          names(results[[s]]),
          if (s == "warn_missing_info") {
            function(f) {
              vars <- results[[s]][[f]]
              paste0(
                if (length(vars) > 50) {
                  paste(prettyNum(length(vars), big.mark = ","), "variables")
                } else {
                  sub("}, ([^}]+)}$", "}, and \\1}", paste0(paste0("{.pkg ", vars, "}"), vapply(vars, function(m) {
                    w <- meta_base == m
                    if (any(w)) paste0(" (base matches {.emph ", names(meta)[which(w)[1]], "})") else ""
                  }, ""), collapse = ", "))
                },
                " in {.field ", f, "}"
              )
            }
          } else {
            function(f) paste0("{.pkg ", results[[s]][[f]], "} in {.field ", f, "}")
          }
        ), use.names = FALSE)
        cli_bullets(structure(missing_info, names = rep(">", length(missing_info))))
      }
    }
  }

  failures <- unique(unlist(results[grep("^fail_", names(results))], use.names = FALSE))
  n_fails <- length(failures)
  if (n_fails) {
    res_summary["FAIL"] <- n_fails
    cli_h2("{n_fails} file{?/s} failed checks")
    sections <- list(
      fail_read = "failed to read in:",
      fail_rows = "contains no data:",
      fail_value_type = "no {.pkg {value_type}} column:",
      fail_time = "no {.pkg {time}} column:",
      fail_dataset = "no {.pkg {dataset}} column:",
      fail_entity_info = "missing entity information ({.pkg {entity_info}}) column{?/s}:",
      fail_idlen_county = "not all county GEOIDs are 5 characters long:",
      fail_idlen_tract = "not all tract GEOIDs are 11 characters long:",
      fail_idlen_block_group = "not all block group GEOIDs are 12 characters long:"
    )
    for (s in names(sections)) {
      if (length(results[[s]])) {
        cli_alert_danger(paste0("{.strong ", sections[[s]], "}"))
        cli_bullets(structure(
          paste0("{.field ", results[[s]], "}"),
          names = rep(">", length(results[[s]]))
        ))
      }
    }
  }

  res_summary["PASS"] <- sum(!files_short %in% c(results$not_considered, warnings, failures))

  cat("\n")
  print(res_summary)
  invisible(results)
}
