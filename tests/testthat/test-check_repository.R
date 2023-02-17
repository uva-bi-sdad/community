test_that("all issues are caught", {
  dir <- paste0(tempdir(), "/test_repo")
  init_repository(dir, "dataset", init_git = FALSE)
  info_file <- paste0(dir, "/dataset/data/distribution/measure_info.json")
  jsonlite::write_json(list(measure = "m_int", type = "integer"), info_file, auto_unbox = TRUE)
  data <- data.frame(
    geoid = c(NA, "10000", "516105003003", "511076110241", "1e10", "1e+10", NA),
    region_name = c(rep("region", 5), NA, "region"),
    region_type = "county",
    year = c(2010, 2010, 2010, 2020, 2011, 2012, NA),
    value = c(1, 1.1, .5, .1, rep(1e-7, 3)),
    measure_type = c("int", "int", "percent", "percent", rep("small", 3)),
    measure = c("m_int", "m_int", "m_perc", "m_perc", rep("m_small", 3))
  )
  data[7, ] <- NA
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
      "compressed", "blank_colnames", "value_nas", "dataset_nas", "scientific", "id_nas", "value_name_nas",
      "entity_info_nas", "missing_info", "bg_agg", "small_percents", "double_ints", "small_values",
      "time_nas", "value_type_nas"
    )),
    paste0("fail_", c("idlen_county", "rows", "time", "value_type", "entity_info", "dataset"))
  )), sort(names(res)))
  expect_warning(data_measure_info(
    info_file,
    m_int = list(
      measure = "m_int", category = "a", type = "int", long_name = "integer", short_name = "integer",
      long_description = "a measure", layer = list(filter = "filter")
    ),
    m_perc = list(
      measure = "m_perc", category = "a", type = "percent", long_name = "integer", short_name = "percent",
      long_description = "an percentage", sources = list(name = list("name")),
      layer = list(source = list("url"))
    ),
    m_small = list(
      measure = "m_small", category = "a", type = "numeric", long_name = "integer", short_name = "small",
      long_description = "an small value", citations = c("a", "b", "absent"),
      sources = list(name = "a source", date_accessed = 2013, url = "example.com"),
      layer = list(source = "url", filter = list(feature = "f"))
    ),
    references = list(
      a = list(
        author = list(list(family = "af")),
        year = 2013,
        title = "a title"
      ),
      b = list(author = "name"),
      broken = list(
        author = list(name = "br f"),
        year = list(1),
        title = list("br title")
      )
    ),
    open_after = FALSE
  ), "no matching reference")
  data$geoid <- substr(format(as.numeric(data$geoid), scientific = FALSE), 1, 5)
  write.csv(data, paste0(dir, "/dataset/data/distribution/data.csv"), row.names = FALSE)
  data_min$Year <- 1
  data_min$Region_Type <- "county"
  data_min$Region_Name <- "a"
  write.csv(data, paste0(dir, "/dataset/data/distribution/data_min.csv"))
  unlink(paste0(dir, "/dataset/data/distribution/data_", c("skip", "invalid"), ".csv"))
  res <- check_repository(dir, attempt_repair = TRUE)
  expect_identical(sort(c("data", "info", paste0("info_", c(
    "refs_missing", "refs_author", "refs_author_entry", "refs_year", "refs_title",
    "source_missing", "source_name", "citation", "layer_source", "layer_filter", "layer_source_url"
  )))), sort(names(res)))
  unlink(dir, TRUE)
})