# rebuild
styler::style_pkg(filetype = c("R", "Rmd"))
spelling::spell_check_package()
devtools::document() 
pkgdown::build_site(lazy = TRUE)

# update site assets

## rebuild minified files
system2("npm", "run build")

## rebuild v1 scripts (if dev should be v1)
if (FALSE) system2("npm", "run build-v1")

## update cache script information
cache_scripts <- list(
  data_handler = list(
    dev = list(
      source = "https://uva-bi-sdad.github.io/community/dist/js/data_handler.min.js",
      location = "docs",
      md5 = tools::md5sum("docs/dist/js/data_handler.min.js")[[1]]
    ),
    stable = list(
      source = "https://uva-bi-sdad.github.io/community/dist/js/data_handler.v1.min.js",
      location = "docs",
      md5 = tools::md5sum("docs/dist/js/data_handler.v1.min.js")[[1]]
    )
  )
)
save(cache_scripts, file = "R/sysdata.rda")

# check
devtools::check()

# generate coverage reports
system2("npm", "test")
covr::report(file = "docs/coverage/package.html", browse = FALSE)

# increment development version
description <- readLines("DESCRIPTION")
description[3] <- paste0(
  sub("\\d+$", "", description[3]),
  as.numeric(substring(description[3], nchar(description[3]) - 2)) + 1
)
writeLines(description, "DESCRIPTION")
