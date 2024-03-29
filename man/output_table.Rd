% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/output_table.R
\name{output_table}
\alias{output_table}
\title{Add a table to a webpage}
\usage{
output_table(variables = NULL, dataset = NULL, dataview = NULL,
  id = NULL, click = NULL, subto = NULL, options = NULL,
  features = NULL, filters = NULL, wide = TRUE, class = "compact",
  datatables = TRUE)
}
\arguments{
\item{variables}{The ID of a variable selecting input, or a list specifying columns (if \code{wide} is
\code{TRUE}) or included variables. Each entry should be a list with at least have a \code{name} entry with a
variable name. A \code{title} entry can be used to set a different display name for the variable. \code{name}
can also refer to feature names, which can be specified with a \code{source} entry set to \code{"features"}.
For example, \code{list(title = "Variable A", name = "a", source = "features")}. A vector can also be used
to specify variable names, with names setting titles (e.g., \code{c("Variable A" = "a")}). If not specified,
sources are attempted to be resolved automatically.}

\item{dataset}{The name of a dataset, or ID of a dataset selector, to find \code{variables} in;
used if \code{dataview} is not specified.}

\item{dataview}{The ID of an \code{\link{input_dataview}} component.}

\item{id}{Unique ID of the table.}

\item{click}{The ID of an input to set to a clicked row's entity ID.}

\item{subto}{A vector of output IDs to receive hover events from.}

\item{options}{A list of configuration options if \code{datatables} is \code{TRUE}, see
\href{https://datatables.net/reference/option}{DataTables Documentation}; otherwise,
only the \code{scrollY} option has an effect.}

\item{features}{A list of features columns to include if multiple variables are included and \code{wide} is
\code{TRUE}.}

\item{filters}{A list with names of \code{meta} entries (from \code{variable} entry in \code{\link{data_add}}'s
\code{meta} list), and values of target values for those entries, or the IDs of value selectors.}

\item{wide}{Logical; if \code{FALSE}, variables and years are spread across rows rather than columns.
If \code{variables} specifies a single variable, \code{wide = FALSE} will show the variable in a column, and
\code{wide = TRUE} will show the variable across time columns.}

\item{class}{Class names to add to the table.}

\item{datatables}{Logical; if \code{TRUE}, uses \href{https://datatables.net}{DataTables}.}
}
\value{
A character vector of the content to be added.
}
\description{
Adds a table to a webpage, based on specified or selected variables.
}
\examples{
output_table()
}
