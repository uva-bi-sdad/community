# Community
An R package bringing together a range of methods as part of a framework for
collecting, documenting, analyzing, and presenting community data (relating to people in places or groups).

## Framework
The package will hope to offer tools to help manage data, derive measurements from them, and present them for analysis:

### Data Ingestion
* Cleaning and standardization methods
* Measures of quality
* Documentation standards

### Measurement Pipelines
* Preprocess pipelines
* Unification of measurement variants
* Standardized output

### Presentation
* Metadata-based site builders
* Static report generators
* Dynamic report templates and standards

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
add_data("data.csv")
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