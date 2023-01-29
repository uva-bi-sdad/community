test_that("all issues are caught", {
  dir <- paste0(tempdir(), "/test_repo")
  init_repository(dir, "dataset", init_git = FALSE)
  info_file <- paste0(dir, "/dataset/data/distribution/measure_info.json")
  jsonlite::write_json(list(measure = "measure", type = "count"), info_file, auto_unbox = TRUE)
  data <- data.frame(
    geoid = c("10000", "516105003003", "511076110241", "1e10", "1e+10", NA),
    region_name = c(rep("region", 4), NA, "region"),
    region_type = "county",
    year = c(2010, 2010, 2020, 2011, 2012, NA),
    value = 1,
    measure = c("measure", rep("unknown", 5))
  )
  data[6, ] <- NA
  write.csv(data, paste0(dir, "/dataset/data/distribution/data.csv"), row.names = FALSE)
  data_min <- data.frame(GEOID = "a", Value = 1, Measure = "a")
  write.csv(data_min, paste0(dir, "/dataset/data/distribution/data_min.csv"))
  write.csv(
    data.frame(geoid = character(), value = numeric(), measure = character()),
    paste0(dir, "/dataset/data/distribution/data_invalid.csv"),
    row.names = FALSE
  )
  write.csv(data.frame(a = 1), paste0(dir, "/dataset/data/distribution/data_skip.csv"), row.names = FALSE)
  res <- check_repository(dir)
  expect_identical(res$fail_rows, "dataset/data/distribution/data_invalid.csv")
  expect_identical(res$not_considered, "dataset/data/distribution/data_skip.csv")
  expect_identical(sort(c(
    "data", "info", "not_considered",
    paste0("info_", c("malformed", "incomplete")),
    paste0("warn_", c(
      "compressed", "blank_colnames", "value_nas", "scientific", "id_nas", "value_name_nas",
      "entity_info_nas", "missing_info", "bg_agg"
    )),
    paste0("fail_", c("idlen_county", "rows", "time", "entity_info", "dataset"))
  )), sort(names(res)))
  data_measure_info(
    info_file,
    measure = list(
      measure = "measure", category = "a", type = "int", short_name = "measure",
      short_description = "a measure"
    ),
    unknown = list(
      measure = "unknown", category = "a", type = "int", short_name = "unknown",
      short_description = "an unknown measure"
    ),
    open_after = FALSE
  )
  data$geoid <- substr(format(as.numeric(data$geoid), scientific = FALSE), 1, 5)
  write.csv(data, paste0(dir, "/dataset/data/distribution/data.csv"), row.names = FALSE)
  data_min$Year <- 1
  data_min$Region_Type <- "county"
  data_min$Region_Name <- "a"
  write.csv(data, paste0(dir, "/dataset/data/distribution/data_min.csv"), row.names = FALSE)
  unlink(paste0(dir, "/dataset/data/distribution/data_", c("skip", "invalid"), ".csv"))
  res <- check_repository(dir, attempt_repair = TRUE)
  expect_identical(c("data", "info"), names(res))
  unlink(dir, TRUE)
})
