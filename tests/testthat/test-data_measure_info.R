path <- paste0(tempdir(), "/measure_info.json")

test_that("makes an initial file", {
  initial <- data_measure_info(path, "measure name" = list(
    measure = "measure name",
    full_name = "prefix:measure name",
    short_description = "A measure.",
    statement = "This entity has {value} measure units."
  ))
  expect_identical(initial, jsonlite::read_json(path))
})

test_that("existing files is added to", {
  addition <- data_measure_info(path, "measure two" = list(
    measure = "measure two",
    full_name = "prefix:measure two",
    short_description = "Another measure.",
    statement = "This entity has {value} measure units.",
    citations = "ref1"
  ), references = list(ref1 = list(author = list(given = "name"))))
  expect_identical(names(addition), c("measure name", "measure two", "_references"))
})

test_that("missing references are flagged", {
  expect_warning(
    data_measure_info(path, "measure three" = list(
      measure = "measure three",
      full_name = "prefix:measure three",
      short_description = "Another measure.",
      statement = "This entity has {value} measure units.",
      citations = c("ref2", "ref3")
    ), include_empty = FALSE),
    "no matching reference entry"
  )
})

test_that("strict works", {
  expect_warning(
    addition <- data_measure_info(path, "measure three" = list(
      custom_entry = "",
      citations = "ref1"
    ), strict = TRUE, include_empty = FALSE),
    "unrecognized entry"
  )
  expect_identical(
    names(addition$`measure three`),
    c("citations", "measure", "full_name", "short_description", "statement")
  )
})
