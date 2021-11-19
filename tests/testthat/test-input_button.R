library(xml2)

test_that("structure is intact", {
  raw <- input_button("reset")
  expect_true(is.character(raw) && !any(raw == ""))
  html <- read_html(paste(raw, collapse = ""))
  children <- xml_child(xml_child(html))
  expect_true(xml_length(children) == 1)
})
