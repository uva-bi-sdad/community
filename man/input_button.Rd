% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/input_button.R
\name{input_button}
\alias{input_button}
\title{Add a button to a website}
\usage{
input_button(label, target = "reset_selection", id = label,
  dataview = NULL, query = list(), from_api = FALSE, class = "", ...,
  note = NULL)
}
\arguments{
\item{label}{Text in the button for the user.}

\item{target}{The ID of an input element to reset, a vector with IDs of input elements as names and values to set
those inputs to as values, or the name of a function to trigger (e.g., \code{c(input_a = 1)}). Available function
are \code{refresh} (to force a reprocessing of the current input state), \code{reset_selection} (to reset all input
elements that are not settings), \code{reset_storage} (to clear local storage, reset all settings, and reload),
\code{export} (to download data), \code{copy} (to save an API link to the clipboard), and
\code{filter} (to open a data filter menu).
This can also be a URL (including protocol) for a button-like link.}

\item{id}{Unique ID of the element to be created.}

\item{dataview}{Name of a data view to get selection and filter options from for export.}

\item{query}{A list of query parameters, if \code{target} is \code{"export"} or \code{"copy"}. See the API section.}

\item{from_api}{Logical; if \code{TRUE}, \code{target} is \code{"export"}, and an endpoint has been provided
in \code{\link{site_build}}, links to the API rather than exporting from the browser.}

\item{class}{Additional class names to add to the element.}

\item{...}{Additional attributes to set on the element.}

\item{note}{Text to display as a tooltip for the button.}
}
\value{
A character vector of the contents to be added.
}
\description{
Adds a button to reset an input or trigger a predefined function (including data export) to a website.
}
\section{API Query}{

The \code{query} argument can be used to specify export options for a download button.
These options can also be included as query parameters in a site API's URL:
\describe{
\item{Format}{
These options affect the format of the returned file:
\itemize{
\item \strong{\code{file_format}}: Specifies the separator between columns:
\code{'csv'} (default) for commas, or \code{'tsv'} for tabs.
\item \strong{\code{table_format}}: Specifies the layout of the data:
\code{'tall'} for a row for each value, with all values in the same column
(repeats over entities, times, and variables);
\code{'mixed'} (default) for a row for each time, with a column for each variable
(repeats over entities);
\code{'wide'} for a row for each entity, with a column for each variable at each time.
\item \strong{\code{features}}: Specifies which features to include in the
first columns of the file: A list with names for year column name, and value with the
feature name to include in that column. Currently not available through the URL.
\item \strong{\code{include}}: Specifies which variables to include:
a vector or variable names, or (for the URL interface) a string with variable
names separated by commas. By default, all variables are included.
\item \strong{\code{exclude}}: Specifies which variables to exclude:
a vector or variable names, or (for the URL interface) a string with variable
names separated by commas.
}
}
\item{Filters}{
These options can be used to subset data:
\itemize{
\item \strong{\code{dataset}}: The name of a dataset, or vector (comma separated string)
of dataset names. Includes all datasets by default.
\item \strong{\code{variable[component]=value}}: Sets conditions
on the summary of a variable. The summary of a variable is within each entity, which results in
a set of summary components: \code{"first"}, \code{"min"}, \code{"mean"}, \code{"sum"},
\code{"max"}, \code{"last"}. The \code{=} sign can be another operator:
\code{"!="}, \code{">="}, \code{"<="}. values can be comma-separated sets of values.
\item \strong{\code{feature=value}}: Sets conditions on a feature of each entity.
\item \strong{\code{time_range}}: Selects a time or time range to include:
\code{">="} or \code{"<="} with a single minimal or maximal time, or \code{"="}
with a single time, or comma-separated set of two times.
}
}
}
}

\examples{
\dontrun{
# a selection reset button
input_button("Reset")

# a button to export all data, plus some added features
input_button("Download All Data", "export", query = list(
  features = list(ID = "id", Feature_A = "ft_a")
))

# a button to export a special subset
# from a URL:
#   https://example.com/api?dataset=set_a&include=variable_a,variable_b&
#   variable_a[min]>=10&feature_a=type_a,type_b
input_button("Download Subset", "export", query = list(
  dataset = "set_a", include = c("variable_a", "variable_b"),
  variable_a = list(component = "min", operator = ">", value = 10),
  feature_a = c("type_a", "type_b")
))
}
}
\seealso{
For buttons to select between a set of options, use \code{\link{input_buttongroup}}.
}
