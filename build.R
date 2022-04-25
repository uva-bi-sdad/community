# rebuild
styler::style_pkg()
spelling::spell_check_package()
devtools::document()
pkgdown::build_site()

# move web resource to dist
update_stable <- FALSE
for (f in list.files("dev", "min\\.[cjs]+$", full.names = TRUE)) {
  file.copy(f, paste0('docs/dist/', sub('^.*\\.', '', f)), TRUE)
  if (grepl("^com", f) && update_stable) file.copy(
    f, paste0('docs/dist/', sub('^.*\\.', '', f), "/", sub(".", ".v1.", f, fixed = TRUE)), TRUE
  )
  file.remove(f)
}

## update cache script information
cache_scripts = list(
  data_handler = list(
    source = "https://uva-bi-sdad.github.io/community/dist/js/data_handler.min.js",
    location = "docs",
    md5 = tools::md5sum("docs/dist/js/data_handler.min.js")[[1]]
  )
)
save(cache_scripts, file = "R/sysdata.rda")

# check
testthat::test_local()
devtools::check()

# generate coverage reports
if (!dir.exists("../test_site")) {
  init_site("test_site", dir = "../test_site")
  source("../test_site/build.R")
  site_build("../test_site")
}
system2("npm", "test")
covr::report(file = "coverage/package.html", browse = FALSE)
system2("xcopy", c("/S /Y", shQuote("coverage"), shQuote("docs/coverage")))

# increment development version
description <- readLines("DESCRIPTION")
description[3] <- paste0(
  sub("\\d+$", "", description[3]),
  as.numeric(substring(description[3], nchar(description[3]) - 2)) + 1
)
writeLines(description, "DESCRIPTION")
