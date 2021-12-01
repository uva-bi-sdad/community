# rebuild
styler::style_pkg()
spelling::spell_check_package()
devtools::document()
pkgdown::build_site()

# move web resource to dist
for(f in paste0('community.min', c('.js', '.css'))) if(file.exists(f)){
  file.copy(f, paste0('docs/dist/', sub('^.*\\.', '', f)), TRUE)
  file.remove(f)
}

# check
testthat::test_local()
devtools::check()
