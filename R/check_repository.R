#' Check Data Repositories
#'
#' Performs a series of checks to see if data in a given repository can be ingested by a datacommons project.
#'
#' @param dir Root directory of the data repository.
#' @param search_pattern Regular expression used to search for data files.
#' @param value Name of the column containing variable values.
#' @param value_name Name of the column containing variable names.
#' @param id Column name of IDs which uniquely identify entities.
#' @param time Column name of the variable representing time.
#' @param dataset Column name used to separate data info sets (such as by region).
#' @param entity_info A vector containing variable names to go into making \code{entity_info.json}.
#' @param attempt_repair Logical; if \code{TRUE}, will attempt to fix some warnings in data files.
#' @examples
#' \dontrun{
#' # from a data repository
#' check_repository()
#'
#' # to automatically fix most warnings
#' check_repository(attempt_repair = TRUE)
#' }
#' @return An invisible list of check results, which may include \strong{general} file paths:
#' \itemize{
#'   \item \strong{\code{info}} (always): A vector paths to \code{measure_info.json} files found.
#'   \item \strong{\code{data}} (always): A vector paths to data files found.
#'   \item \strong{\code{not_considered}}: A vector paths to data files that do not contain the minimal
#'     columns, and so are considered to be different types of files.
#' }
#' or those relating to \strong{measure information} specific issues:
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
#'   \item \strong{\code{warn_value_name_nas}}: Files that have \code{NA}s in their \code{name} column.
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
#'   \item \strong{\code{fail_time}}: Files with no \code{time} column.
#'   \item \strong{\code{fail_dataset}}:Files with no \code{dataset} column .
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
                             id = "geoid", time = "year", dataset = "region_type", entity_info = c("region_type", "region_name"),
                             attempt_repair = FALSE) {
  if (!dir.exists(dir)) cli_abort("{.field {dir}} does not exist")
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
            paste(paste0("{.field ", mf, "}"), collapse = ", ")
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
  census_geolayers <- c(county = 5, tract = 11, "block group" = 12)
  required <- c(id, value_name, value)
  vars <- unique(c(required, time, dataset, entity_info))
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
          d[[id]] <- as.character(d[[id]])
          if (any(cols == "")) results$warn_blank_colnames <- c(results$warn_blank_colnames, f)
          if (!time %in% cols) results$fail_time <- c(results$fail_time, f)
          all_entity_info <- all(entity_info %in% cols)
          if (!all_entity_info) results$fail_entity_info <- c(results$fail_entity_info, f)

          if (attempt_repair) {
            repairs <- NULL
            if (!grepl("\\.[bgx]z2?$", f)) repairs <- "compression"
            if (anyNA(d[[value]])) {
              d <- d[!is.na(d[[value]]), ]
              repairs <- c(repairs, "NAs")
            }
            su <- grep("\\de[+-]?\\d", d[[id]])
            if (length(su)) {
              d[[id]][su] <- gsub("^\\s+|\\s+$", "", format(as.numeric(d[[id]][su]), scientific = FALSE))
              repairs <- c(repairs, "scientific notation")
            }
            if (nrow(d)) {
              if (anyNA(d[[id]])) {
                repairs <- c(repairs, "{id} NAs")
                d <- d[!is.na(d[[id]]), ]
              }
            }
            if (nrow(d)) {
              if (anyNA(d[[value_name]])) {
                repairs <- c(repairs, "{value_name} NAs")
                d <- d[!is.na(d[[value_name]]), ]
              }
            }
            if (nrow(d) && dataset %in% cols) {
              if (anyNA(d[[dataset]])) {
                repairs <- c(repairs, "{dataset} NAs")
                d <- d[!is.na(d[[dataset]]), ]
              }
            }
            if (nrow(d) && time %in% cols) {
              if (anyNA(d[[time]])) {
                repairs <- c(repairs, "{time} NAs")
                d <- d[!is.na(d[[time]]), ]
              }
            }
            if (nrow(d) && all_entity_info) {
              if (anyNA(d[, entity_info])) {
                repairs <- c(repairs, "{time} NAs")
                d <- d[rowSums(is.na(d[, entity_info, drop = FALSE])) == 0, ]
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
                  cli_alert_danger("{.strong failed to write repairs ({repairs}) to {.file {f}}}")
                } else {
                  if (path != tf) {
                    unlink(path)
                  }
                  cli_alert_info("{.strong wrote repairs ({repairs}) to {.file {tf}}}")
                }
              }
            }
          } else {
            if (!grepl("[bgx]z2?$", f)) results$warn_compressed <- c(results$warn_compressed, f)
            if (anyNA(d[[value]])) results$warn_value_nas <- c(results$warn_value_nas, f)
            if (any(grepl("\\de[+-]\\d", d[[id]]))) results$warn_scientific <- c(results$warn_scientific, f)
            if (anyNA(d[[id]])) results$warn_id_nas <- c(results$warn_id_nas, f)
            if (anyNA(d[[value_name]])) {
              results$warn_value_name_nas <- c(results$warn_value_name_nas, f)
              d <- d[!is.na(d[[value_name]]), ]
            }
            if (dataset %in% cols && anyNA(d[[dataset]])) {
              d[[dataset]][is.na(d[[dataset]])] <- ""
              results$warn_dataset_nas <- c(results$warn_dataset_nas, f)
            }
            if (all_entity_info && anyNA(d[, entity_info])) results$warn_entity_info_nas <- c(results$warn_entity_info_nas, f)
            if (time %in% cols) {
              if (anyNA(d[[time]])) {
                results$warn_time_nas <- c(results$warn_time_nas, f)
                d <- d[!is.na(d[[time]]), ]
              }
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
            su <- !measures %in% names(meta)
            if (any(su)) su[su] <- !make_full_name(f, measures[su]) %in% names(meta)
            if (any(su)) results$warn_missing_info <- c(results$warn_missing_info, paste0(f, "::", measures[su]))

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
      "not include all base columns ({.field {required}}):}"
    ))
    cli_bullets(structure(
      paste0("{.field ", results$not_considered, "}"),
      names = rep(">", length(results$not_considered))
    ))
  }

  warnings <- unique(sub("::.*$", "", unlist(
    results[grep("^warn_", names(results))],
    use.names = FALSE
  )))
  n_warn <- length(warnings)
  if (n_warn) {
    res_summary["WARN"] <- n_warn
    cli_h2("{n_warn} file{? has/s have} warnings")
    sections <- list(
      warn_compressed = "not compressed:",
      warn_blank_colnames = "contains blank column names:",
      warn_value_nas = "{.field {value}} column contains NAs (which are redundant):",
      warn_id_nas = "{.field {id}} column contains NAs:",
      warn_value_name_nas = "{.field {value_name}} column contains NAs:",
      warn_dataset_nas = "{.field {dataset}} column contains NAs:",
      warn_time_nas = "{.field {time}} column contains NAs:",
      warn_entity_info_nas = "entity information column{?/s} ({.field {entity_info}}) contain{?s/} NAs:",
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
    if (length(results$warn_missing_info)) {
      cli_alert_warning("{.strong missing measure info entries:}")
      meta_base <- sub("^[^:]*:", "", names(meta))
      missing_info <- unlist(lapply(
        strsplit(results$warn_missing_info, "::", fixed = TRUE),
        function(e) {
          base_matches <- if (e[2] %in% meta_base) names(meta)[meta_base == e[2]] else NULL
          paste0(
            "{.field ", e[2], "} in {.field ", e[1], "}", if (length(base_matches)) {
              paste0(
                "; base matches {.arg ", base_matches[1], "}, but prefix is invalid"
              )
            }
          )
        }
      ), use.names = FALSE)
      cli_bullets(structure(missing_info, names = rep(">", length(missing_info))))
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
      fail_time = "no {.field {time}} column:",
      fail_dataset = "no {.field {dataset}} column:",
      fail_entity_info = "missing entity information ({.field {entity_info}}) column{?/s}:",
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
