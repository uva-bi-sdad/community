library(xml2)

test_that("structure is intact", {
  raw <- output_info()
  expect_true(is.character(raw) && !any(raw == ""))
  html <- read_html(paste(raw, collapse = ""))
  children <- xml_child(html)
  expect_true(xml_length(children) == 1)
  children <- xml_child(children)
  expect_true(xml_length(xml_child(children)) == 3)
})
