# rebuild
styler::style_pkg()
devtools::document()
spelling::spell_check_package()
pkgdown::build_site()

# check
testthat::test_local()
devtools::check()
