library(xml2)

test_that("structure is intact", {
  raw <- page_menu(input_select("menu item", "id", c("a", "b", "c")))
  expect_true(is.character(raw) && !any(raw == ""))
  html <- read_html(paste(raw, collapse = ""))
  children <- xml_child(html)
  expect_true(xml_length(children) == 1)
  children <- xml_child(children)
  expect_true(xml_length(children) == 2)
  children <- xml_child(children)
  expect_true(xml_length(xml_child(xml_child(children))) == 2)
})
