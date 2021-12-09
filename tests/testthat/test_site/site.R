library(community)
# prepare and connect data in build.R

# use `page_` functions to add parts of a page:
page_navbar("Motor Trend Car Road Tests")

# use `input_` functions to add input elements that affect outputs:
input_select("Select a Variable", options = "variables", label = "variable", default = "wt")

# use `output_` functions to data display components:
output_plot("variable", "mpg")

# render the site:
site_build("F:/Content/Projects/packages/community/tests/testthat/test_site", bundle_data = TRUE, open_after = TRUE)
