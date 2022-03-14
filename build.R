# rebuild
styler::style_pkg()
spelling::spell_check_package()
devtools::document()
pkgdown::build_site()

# move web resource to dist
update_stable <- TRUE
for (f in paste0('community.min', c('.js', '.css'))) if (file.exists(f)) {
  file.copy(f, paste0('docs/dist/', sub('^.*\\.', '', f)), TRUE)
  if (update_stable) file.copy(f, paste0('docs/dist/', sub('^.*\\.', '', f), "/", sub(".", ".v1.", f, fixed = TRUE)), TRUE)
  file.remove(f)
}

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
