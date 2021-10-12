library(xml2)

test_that("structure is intact", {
  raw <- output_map()
  expect_true(is.character(raw) && !any(raw == ""))
  html <- read_html(raw)
  expect_true(xml_length(xml_child(html)) == 1)
})
