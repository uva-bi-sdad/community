# Community

An R package to build static data exploration dashboards (data sites).

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

## JavaScript Development

This project uses Rollup to assemble the development JavaScript files into the scripts that run
data sites (in a web browser and/or in a Node environment as part of an API).

[Visual Studio Code](https://code.visualstudio.com) is recommended for automatic code styling.

To start working on the JavaScript source, first ensure [Node.js](https://nodejs.org) is installed,
then install the development dependencies:

```bash
npm install
```

Then you can start Rollup in development mode, which will watch the source files to rebuild the
development scripts whenever they are changed, and serve them on `http://localhost:8000`:

```bash
npm start
```

The development scripts can be worked with in a running site by starting a development server, and adding
`version = "local"` to the `site_build` command for that site.

### Testing

Run the JavaScript tests to rebuild the coverage report in `docs/coverage`:

```bash
npm test
```

### Production

This will rebuild the distributed, minified JavaScript and CSS files that are used in current data sites:

```bash
npm run build
```

That updates the "dev" versions of the distribution assets, where `build-v1` will update the "v1" assets.
