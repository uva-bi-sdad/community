test_that("parse cases properly", {
  expect_equal(
    list(
      id = "variable",
      states = list(
        list(
          condition = list(
            list(id = "a", type = "!", value = "")
          ),
          value = 0
        ),
        list(
          condition = list(
            list(id = "b", type = "", value = "")
          ),
          value = 0
        ),
        list(
          condition = list(
            list(id = "c", type = "=", value = 1)
          ),
          value = 1
        )
      ),
      default = ""
    ),
    input_variable("variable", list(
      "!a" = 0,
      "b" = 0,
      "c == 1" = 1
    ))
  )
})
