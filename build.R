# rebuild
devtools::document()
styler::style_pkg()
spelling::spell_check_package()
pkgdown::build_site()

# check
testthat::test_local()
devtools::check()
