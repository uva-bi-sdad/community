library(xml2)

test_that("structure is intact", {
  raw <- input_slider("label")
  expect_true(is.character(raw) && !any(raw == ""))
  html <- read_html(paste(raw, collapse = ""))
  children <- xml_child(html)
  expect_true(xml_length(children) == 1)
  children <- xml_child(children)
  expect_true(xml_length(children) == 2)
  children <- xml_child(children, 2)
  expect_true(xml_length(children) == 0)
})
