% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/page_head.R
\name{page_head}
\alias{page_head}
\title{Write content to the head of a website}
\usage{
page_head(..., title = "", description = "", icon = "")
}
\arguments{
\item{...}{Content to be added to the \code{<head>} tag, such as a \code{<meta>} or \code{<link>} tag.}

\item{title}{Text to appear as the site's name (as in a browser tab); added to a \code{<title>} tag.}

\item{description}{Text describing the site; added to a \code{<meta>} tag.}

\item{icon}{Path to an image for the site's icon.}
}
\value{
A character vector of the content to be added.
}
\description{
Adds to the \code{<head>} tag of a page being build with \code{\link{site_build}}.
}
\examples{
\dontrun{
page_head(title = "Site Name")
}
}
