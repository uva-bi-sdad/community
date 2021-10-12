library(xml2)

test_that("structure is intact", {
  raw <- page_head(title = "title", description = "description", icon = "url")
  expect_true(xml_length(xml_child(read_html(paste(raw$title, collapse = "")))) == 2)
  expect_true(xml_length(xml_child(read_html(raw$description))) == 1)
  expect_true(xml_length(xml_child(read_html(raw$icon))) == 1)
})
