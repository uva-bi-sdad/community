library(xml2)

test_that("structure is intact", {
  raw <- output_text("text")
  expect_true(is.character(raw) && !any(raw == ""))
  html <- read_html(paste(raw, collapse = ""))
  expect_true(xml_length(html) == 1)
})
