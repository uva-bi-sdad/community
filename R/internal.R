init_package <- function(name = "package", dir = ".") {
  dir.create(paste0(dir, "/", name, "/R"), FALSE, TRUE)
  dir.create(paste0(dir, "/", name, "/inst/specs"), FALSE, TRUE)
  dir.create(paste0(dir, "/", name, "/tests/testthat"), FALSE, TRUE)
}

parse_rule <- function(condition) {
  conds <- strsplit(gsub("\\s*([&|><=]+|!=+)\\s*", " \\1 ", gsub("=+", "=", condition)), " [&|]+ ")[[1]]
  lapply(conds, function(co) {
    co <- strsplit(co, "\\s")[[1]]
    if (length(co) == 1) co <- c(sub("^!+", "", co), if (grepl("^!\\w", co)) "!" else "", "")
    if (tolower(co[2]) %in% c("true", "false")) {
      list(
        id = co[1],
        type = if (tolower(co[2]) == "true") "" else "!",
        value = ""
      )
    } else {
      list(
        id = co[1],
        type = co[2],
        value = if (grepl("^\\d+$", co[3])) {
          as.numeric(co[3])
        } else {
          gsub("[\"']", "", co[3])
        }
      )
    }
  })
}

to_input_row <- function(e) {
  c(
    '<div class="col">', e[2], "</div>",
    '<div class="col">', e[-c(1:2, length(e))], "</div>"
  )
}
