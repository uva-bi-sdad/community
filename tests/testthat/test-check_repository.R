test_that("all issues are caught", {
  dir <- paste0(tempdir(), "/test_repo")
  init_repository(dir, "dataset")
  data_measure_info(
    paste0(dir, "/dataset/data/distribution/measure_info.json"),
    measure = list(), open_after = FALSE, overwrite = TRUE
  )
  data <- data.frame(
    geoid = c("10000000000", "516105003003", "511076110241", "1e10", "1e+10", NA),
    region_name = c(rep("region", 4), NA, "region"),
    region_type = "type",
    year = c(2010, 2010, 2020, 2011, 2012, NA),
    value = 1,
    measure = c("measure", rep("unknown", 5))
  )
  data[6, ] <- NA
  write.csv(data, paste0(dir, "/dataset/data/distribution/data.csv"), row.names = FALSE)
  write.csv(
    data.frame(geoid = character(), value = numeric(), measure = character()),
    paste0(dir, "/dataset/data/distribution/data_invalid.csv"),
    row.names = FALSE
  )
  write.csv(data.frame(a = 1), paste0(dir, "/dataset/data/distribution/data_skip.csv"), row.names = FALSE)
  res <- check_repository(dir)
  expect_identical(res$fail_rows, "dataset/data/distribution/data_invalid.csv")
  expect_identical(res$not_considered, "dataset/data/distribution/data_skip.csv")
  expect_true(all(c(
    "data", "info", "info_incomplete", "warn_compressed", "warn_value_nas", "warn_id_nas",
    "warn_value_name_nas", "warn_missing_info", "warn_bg_agg", "warn_tr_agg", "fail_rows",
    "not_considered"
  ) %in% names(res)))
  data_measure_info(
    paste0(dir, "/dataset/data/distribution/measure_info.json"),
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
  data$geoid <- substr(data$geoid, 1, 5)
  write.csv(data, paste0(dir, "/dataset/data/distribution/data.csv"), row.names = FALSE)
  res <- check_repository(dir, attempt_repair = TRUE)
  expect_identical(c("data", "info", "fail_rows", "not_considered"), names(res))
  unlink(dir, TRUE)
})
