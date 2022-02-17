library(xml2)

test_that("structure is intact", {
  raw <- page_panel("title", input_select("menu item", c("a", "b", "c")))
  expect_true(is.character(raw) && !any(raw == ""))
  html <- read_html(paste(raw, collapse = ""))
  children <- xml_child(html)
  expect_true(xml_length(children) == 1)
  children <- xml_child(children)
  expect_true(xml_length(children) == 2)
  children <- xml_child(xml_child(xml_child(xml_child(children, 2))))
  expect_true(xml_length(children) == 3)
})
