#' Makes a measurement metadata file
#'
#' Make a \code{measure_info.json} file, or add measure entries to an existing one.
#'
#' @param path Path to the \code{measure_info.json} file, existing or to be created.
#' @param ... Lists containing individual measure items. See the Measure Entries section.
#' @param info A list containing measurement information to be added.
#' @param references A list containing citation entries. See the Reference Entries section.
#' @param strict Logical; if \code{TRUE}, will only allow recognized entries and values.
#' @param include_empty Logical; if \code{FLASE}, will omit entries that have not been provided.
#' @param overwrite_entry Logical; if \code{TRUE}, will replace rather than add to an existing entry.
#' @param overwrite Logical; if \code{TRUE}, will overwrite rather than add to an existing \code{path}.
#' @param verbose Logical; if \code{FALSE}, will not display status messages.
#' @param open_after Logical; if \code{FALSE}, will not open the measure file after writing/updating.
#' @section Measure Entries:
#' Measure entries are named by the full variable name with any of these entries (if \code{strict}):
#' \itemize{
#'   \item \strong{\code{measure}}: Name of the measure.
#'   \item \strong{\code{full_name}}: Full name of the measure, which is also the name of the entry.
#'   \item \strong{\code{short_name}}: Shortest possible display name.
#'   \item \strong{\code{long_name}}: Longer display name.
#'   \item \strong{\code{category}}: Arbitrary category for the measure.
#'   \item \strong{\code{short_description}}: Shortest possible description.
#'   \item \strong{\code{long_description}}: Complete description. Either description can include
#'     TeX-style equations, surrounded by \code{$}s (e.g.,
#'     \code{"The equation $a_{i} = b^\\\\frac{c}{d}$ was used."}). These are pre-rendered to MathML with
#'     \code{\link[katex]{katex_mathml}}.
#'   \item \strong{\code{statement}}: String with dynamic references to entity features
#'     (e.g., \code{"measure value = {value}"}). References can include:
#'     \itemize{
#'       \item \code{value}: Value of a currently displaying variable at a current time.
#'       \item \code{region_name}: Alias of \code{feature.name}.
#'       \item \code{feature.<entry>}: An entity feature, coming from \code{entity_info.json} or GeoJSON properties.
#'         All entities have at least \code{name} and \code{id} entries (e.g., \code{"{feature.id}"}).
#'       \item \code{variables.<entry>}: A variable feature such as \code{name} which is the same as
#'         \code{full_name} (e.g., \code{"{variables.name}"}).
#'       \item \code{data.<variable>}: The value of another variable at a current time (e.g., \code{"{data.variable_a}"}).
#'     }
#'   \item \strong{\code{measure_type}}: Type of the measure's value. Recognized types are displayed in a special way:
#'     \itemize{
#'       \item \code{year} or \code{integer} show as entered (usually as whole numbers). Other numeric
#'         types are rounded to show a set number of digits.
#'       \item \code{percent} shows as \code{{value}\%}.
#'       \item \code{minutes} shows as \code{{value} minutes}.
#'       \item \code{dollar} shows as \code{${value}}.
#'       \item \code{internet speed} shows as \code{{value} MB/s}.
#'     }
#'   \item \strong{\code{unit}}: Prefix or suffix associated with the measure's type, such as \code{\%} for \code{percent},
#'     or \code{MB/s} for \code{rate}.
#'   \item \strong{\code{sources}}: A list or list of list containing source information, including any of these entries:
#'     \itemize{
#'       \item \code{name}: Name of the source (such as an organization name).
#'       \item \code{url}: General URL of the source (such as an organization's website).
#'       \item \code{location}: More specific description of the source (such as a the name of a particular data product).
#'       \item \code{location_url}: More direct URL to the resource (such as a page listing data products).
#'       \item \code{date_accessed}: Date of retrieval (arbitrary format).
#'     }
#'   \item \strong{\code{citations}}: A vector of reference ids (the names of \code{reference} entries; e.g., \code{c("ref1", "ref3")}).
#'   \item \strong{\code{layer}}: A list specifying an \code{\link{output_map}} overlay:
#'     \itemize{
#'       \item \code{source} (required): A URL to a GeoJSON file, or a list with a \code{url} and \code{time} entry, where
#'         \code{time} conditions the display of the layer on the current selected time. Alternative to a list that specifies time,
#'         the URL can include a dynamic reference to time, if the time values correspond to a component of the URL
#'         (e.g., \code{"https://example.com/{time}/points.geojson"}).
#'       \item \code{filter}: A list or list of lists specifying how the elements of the layer should be filtered for this variable:
#'         \itemize{
#'           \item \code{feature}: Name of the layer's property to filter on.
#'           \item \code{operator}: Operator to filter by (e.g., \code{"="} or \code{"!="}).
#'           \item \code{value}: Value to filter by.
#'         }
#'     }
#' }
#' @section Reference Entries:
#' Reference entries can be included in a \code{_references} entry, and should have names corresponding to
#' those included in any of the measures' \code{citation} entries. These can include any of these entries:
#' \itemize{
#'   \item \strong{\code{id}}: The reference id, same as the entry name.
#'   \item \strong{\code{author}}: A list or list of lists specifying one or more authors. These can include
#'     entries for \code{given} and \code{family} names.
#'   \item \strong{\code{year}}: Year of the publication.
#'   \item \strong{\code{title}}: Title of the publication.
#'   \item \strong{\code{journal}}: Journal in which the publication appears.
#'   \item \strong{\code{volume}}: Volume number of the journal.
#'   \item \strong{\code{page}}: Page number of the journal.
#'   \item \strong{\code{doi}}: Digital Object Identifier, from which a link is made (\code{https://doi.org/{doi}}).
#'   \item \strong{\code{version}}: Version number of software.
#'   \item \strong{\code{url}}: Link to the publication, alternative to a DOI.
#' }
#' @examples
#' path <- tempfile()
#'
#' # make an initial file
#' data_measure_info(path, "measure name" = list(
#'   measure = "measure name",
#'   full_name = "prefix:measure name",
#'   short_description = "A measure.",
#'   statement = "This entity has {value} measure units."
#' ), verbose = FALSE)
#'
#' # add another measure to that
#' measure_info <- data_measure_info(path, "measure two" = list(
#'   measure = "measure two",
#'   full_name = "prefix:measure two",
#'   short_description = "Another measure.",
#'   statement = "This entity has {value} measure units."
#' ), verbose = FALSE)
#' names(measure_info)
#'
#' @return An invisible list containing measurement metadata.
#' @export

data_measure_info <- function(path, ..., info = list(), references = list(), strict = FALSE, include_empty = TRUE,
                              overwrite_entry = FALSE, overwrite = FALSE, verbose = TRUE, open_after = interactive()) {
  if (missing(path) || !is.character(path)) cli_abort("enter a path to the measure_info.json file as {.arg path}")
  dir.create(dirname(path), FALSE, TRUE)
  built <- list()
  if (!overwrite && file.exists(path)) {
    if (verbose) cli_bullets(c(i = "updating existing file: {.path {basename(path)}}"))
    built <- jsonlite::read_json(path)
    if (all(c("measure", "measure_type") %in% names(built))) {
      built <- list(built)
      names(built) <- built[[1]]$measure
    }
  }
  if (length(references)) {
    references <- c(references, built$`_references`)
    references <- references[!duplicated(names(references))]
    built$`_references` <- references
  } else {
    references <- built$`_references`
  }
  defaults <- list(
    measure = "",
    full_name = "",
    short_name = "",
    long_name = "",
    category = "",
    short_description = "",
    long_description = "",
    statement = "",
    measure_type = "",
    unit = "",
    sources = list(),
    citations = list(),
    layer = list()
  )
  info <- c(list(...), info)
  if (is.null(names(info))) cli_abort("supplied measure entries must be named")
  for (n in names(info)) {
    if (overwrite_entry || is.null(built[[n]])) {
      l <- info[[n]]
    } else {
      l <- c(info[[n]], built[[n]])
      l <- l[!duplicated(names(l))]
    }
    if (is.null(l$full_name)) l$full_name <- n
    if (strict) {
      su <- names(l) %in% names(defaults)
      if (verbose && any(!su)) cli_warn(paste0("unrecognized {?entry/entries} in ", n, ": {names(l)[!su]}"))
      if (include_empty) {
        for (e in names(l)) {
          if (!is.null(defaults[[e]])) {
            defaults[[e]] <- l[[e]]
          }
        }
        l <- defaults
      } else {
        l <- l[su]
      }
    } else if (include_empty) {
      su <- !names(defaults) %in% names(l)
      if (any(su)) l <- c(l, defaults[su])
    }
    if (verbose && !is.null(l$citations)) {
      su <- !l$citations %in% names(references)
      if (any(su)) cli_warn("no matching reference entry for {.val {l$citations[su]}} in {.val {n}}")
    }
    built[[n]] <- l
  }
  built <- built[order(grepl("^_", names(built)))]
  if (verbose) cli_bullets(c(i = "writing info to {.path {path}}"))
  jsonlite::write_json(built, path, auto_unbox = TRUE, pretty = TRUE)
  if (open_after) navigateToFile(path)
  invisible(built)
}
