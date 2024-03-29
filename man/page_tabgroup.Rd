% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/page_tabgroup.R
\name{page_tabgroup}
\alias{page_tabgroup}
\title{Adds a group of tabs to a website}
\usage{
page_tabgroup(..., id = NULL, class = NULL, condition = NULL)
}
\arguments{
\item{...}{A separately entered list for each tab and its content. Named entries in each tab entry can be
\code{"name"} (for the text appearing in the navigation tab), \code{"id"}, \code{"class"}, and \code{"condition"}.
Unnamed entries in each list entry are considered the content to be added to the tab's pane. See examples.}

\item{id}{Unique ID of the tabgroup.}

\item{class}{A class name to add to the tabgroup.}

\item{condition}{A string representing the display condition of the entire tabgroup.}
}
\value{
A character vector of the content to be added.
}
\description{
Adds a group of tabs, each of which contains input and/or output components.
}
\details{
See the \href{https://getbootstrap.com/docs/5.1/layout/grid}{Bootstrap grid documentation}.
}
\examples{
\dontrun{
page_tabgroup(
  "Map" = list(id = "map_tab", output_map()),
  "Data" = list(output_table()),
)
}
}
