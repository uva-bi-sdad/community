# Community

An R package bringing together a range of methods as part of a framework for
collecting, documenting, analyzing, and presenting community data (relating to people in places or groups).

See the [wiki](https://github.com/uva-bi-sdad/community/wiki) for more about how the package and data
sites work.

## Installation

Download R from [r-project.org](https://www.r-project.org/), then install the package from an R console:

```R
# install.packages('remotes')
remotes::install_github('uva-bi-sdad/community')
```

And load the package:

```R
library(community)
```

## Use Cases

### Documenting a Dataset

```R
# say you had some data like this
data <- data.frame(
  x = rnorm(100),
  y = rnorm(100),
  g = sample(letters[1:5], 100, TRUE)
)

# in a file like this
write.csv(data, "data.csv", row.names = FALSE)

# you would make a datapackage.json file to document it like this
init_data("example_data", path = "data.csv")

# or like this
init_data("example_data", overwrite = TRUE)
data_add("data.csv")
```

### Making a Data Site

Data sites build off of data documentation to present datasets interactively.

This example creates a site to explore the `mtcars` dataset:

```R
# initialize the site in a new directory
init_site("example_site", dir = "../example_site")

# use the created build.R file to prepare and add data
# the result should be a plain-text, tabular file with variables in columns
source("../example_site/build.R")

# finally, specify the site in the site.R file, then build it
site_build("../example_site", bundle_data = TRUE, open_after = TRUE)
```

See the [Build a Data Site](https://uva-bi-sdad.github.io/community/articles/quickstart-site.html) article for more.

## JavaScript Testing

To run the JavaScript tests, first make sure [Node.js](https://nodejs.org) is installed
and a test site has been created from R:
```R
init_site("test_site", dir = "../test_site")
source("../test_site/build.R")
site_build("../test_site")
```

Then install dependencies from a terminal in the package directory:

```bash
npm install
```

and run the tests, which will also rebuild the html report in the created `coverage` directory:

```bash
npm test
```
