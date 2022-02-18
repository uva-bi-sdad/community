library(xml2)

test_that("structure is intact", {
  raw <- output_text("text")
  expect_true(is.character(raw) && !any(raw == ""))
  html <- read_html(paste(raw, collapse = ""))
  expect_true(xml_length(html) == 1)
})

test_that("build environment is added to", {
  content <- output_text("displaying", id = "text0")
  parts <- make_build_environment()
  eval(expression(
    output_text("displaying")
  ), parts)
  expect_identical(parts$content, content)
  expect_true(parts$uid == 1)
  expect_true(parts$text$text0$text[[1]] == "displaying")
})
