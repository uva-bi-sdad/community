% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/page_popup.R
\name{page_popup}
\alias{page_popup}
\title{Adds a modal dialog (popup) to a website}
\usage{
page_popup(text = "Popup", ..., title = text, footer = NULL,
  wraps = NA, sizes = NA, breakpoints = NA, conditions = "",
  id = NULL)
}
\arguments{
\item{text}{Text in the triggering button.}

\item{...}{Elements to appear in the popup's body area.}

\item{title}{Content to appear in the popup's header area. Defaults to \code{text}.}

\item{footer}{A list of elements to include in the footer.}

\item{wraps}{The class of wrapper to place elements in; either \code{"row"}, \code{"col"}, or \code{""}
(to not wrap the element). Can specify 1 for every element, or a different class for each element.}

\item{sizes}{The relative size of each wrapper, between 1 and 12, or \code{"auto"}; default is equal size.}

\item{breakpoints}{Bootstrap breakpoint of each wrapper; one of \code{""} (extra small), \code{"sm"},
\code{"md"}, \code{"lg"}, \code{"xl"}, or \code{"xxl"}.}

\item{conditions}{A character for each element representing the conditions in which that should be showing
(e.g., \code{c("", "input_a == a", "")}); \code{""} means the element's display is not conditional.
Adding \code{"lock: "} before the condition will disable inputs rather than hide the element.}

\item{id}{Unique ID of the section.}
}
\value{
A character vector of the content to be added.
}
\description{
Adds a button which triggers a modal dialog (popup) with specified content.
}
\details{
See the \href{https://getbootstrap.com/docs/5.1/layout/grid}{Bootstrap grid documentation}.
}
\examples{
\dontrun{
page_popup(
  "<h1>Title</h1>",
  "<p>body</p>",
)
}
}
