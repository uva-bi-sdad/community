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

This project uses webpack to assemble the development JavaScript files into the scripts that run
data sites (in a web browser and/or in a Node environment as part of an API).

[Visual Studio Code](https://code.visualstudio.com) is recommended for automatic code styling.

To start working on the JavaScript source, first ensure [Node.js](https://nodejs.org) is installed,
then install the development dependencies:

```bash
npm install
```

Then you can start webpack in development mode, which will watch the source files and rebuild the
final bundles whenever they are changed:

```bash
npm run start
```

The rebuilt scripts can be worked with in a running site by adding `version = "local"` to the
`site_build` command for that site. This depends on a symlink being present between the `community`
directory and a `docs/dist` directory in the site's directory. That is, with `version = "local"`,
the site will load assets from `/dist/dev/` (e.g., the core site script would be at
`http://localhost:3000/dist/dev/community.js` by default with `serve = TRUE`).

### Testing

To run the JavaScript tests, first make a test site from R:

```R
init_site("test_site", dir = "../test_site")
source("../test_site/build.R")
site_build("../test_site")
```

Then run the tests, which will also rebuild the html report in the created `docs/coverage` directory:

```bash
npm test
```

### Production

This will rebuild the distributed, minified JavaScript and CSS files that are used in current data sites:

```bash
npm run build
```

That updates the "dev" versions of the distribution scripts, where `build-v1` will update the "v1" scripts.
