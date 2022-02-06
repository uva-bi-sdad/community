test_that("parse condition properly", {
  expect_equal(
    list(
      condition = list(
        list(id = "a", type = "=", value = 1, any = FALSE),
        list(id = "b", type = "=", value = 2, any = FALSE)
      ),
      effects = list(c = 3)
    ),
    input_rule("a == 1 && b == 2", list(c = 3))
  )
})
