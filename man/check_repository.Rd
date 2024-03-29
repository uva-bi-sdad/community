% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/check_repository.R
\name{check_repository}
\alias{check_repository}
\title{Check Data Repositories}
\usage{
check_repository(dir = ".", search_pattern = "\\\\.csv(?:\\\\.[gbx]z2?)?$",
  exclude = NULL, value = "value", value_name = "measure",
  id = "geoid", time = "year", dataset = "region_type",
  entity_info = c("region_type", "region_name"), check_values = TRUE,
  attempt_repair = FALSE, write_infos = FALSE, verbose = TRUE)
}
\arguments{
\item{dir}{Root directory of the data repository.}

\item{search_pattern}{Regular expression used to search for data files.}

\item{exclude}{Subdirectories to exclude from the file search.}

\item{value}{Name of the column containing variable values.}

\item{value_name}{Name of the column containing variable names.}

\item{id}{Column name of IDs that uniquely identify entities.}

\item{time}{Column name of the variable representing time.}

\item{dataset}{Column name used to separate data into sets (such as by region), or a vector
of datasets, with \code{id}s as names, used to map IDs to datasets.}

\item{entity_info}{A vector of variable names to go into making \code{entity_info.json}.}

\item{check_values}{Logical; if \code{FALSE}, will perform more intensive checks on values.
If not specified, these are skipped if there are more that 5 million rows in the given dataset,
in which case \code{TRUE} will force checks.}

\item{attempt_repair}{Logical; if \code{TRUE}, will attempt to fix most warnings in data files.
Use with caution, as this will often remove rows (given \code{NA}s) and rewrite the file.}

\item{write_infos}{Logical; if \code{TRUE}, will save standardized and rendered versions of each measure info file.}

\item{verbose}{Logical; If \code{FALSE}, will not print status messages or check results.}
}
\value{
An invisible list of check results, in the form of paths to files and/or measure name.
These may include \strong{general} entries:
\itemize{
\item \strong{\code{info}} (always): All measurement information (\code{measure_info.json}) files found.
\item \strong{\code{data}} (always): All data files found.
\item \strong{\code{not_considered}}: Subset of data files that do not contain the minimal
columns (\code{id} and \code{value}), and so are not checked further.
\item \strong{\code{summary}} (always): Summary of results.
}
or those relating to issues with \strong{measure information} (see \code{\link{data_measure_info}}) files:
\itemize{
\item \strong{\code{info_malformed}}: Files that are not in the expected format (a single object with
named entries for each measure), but can be converted automatically.
\item \strong{\code{info_incomplete}}: Measure entries that are missing some of the required fields.
\item \strong{\code{info_invalid}}: Files that could not be read in (probably because they do not contain valid JSON).
\item \strong{\code{info_refs_names}}: Files with a \code{_references} entry with no names
(where it should be a named list).
\item \strong{\code{info_refs_missing}}: Files with an entry in its \code{_references} entry that
is missing one or more required entries (\code{author}, \code{year}, and/or \code{title}).
\item \strong{\code{info_refs_*}}: Files with an entry in its \code{_references} entry that has an entry
(\code{*}) that is a list (where they should all be strings).
\item \strong{\code{info_refs_author_entry}}: Files with an entry in its \code{_references} entry that has an
\code{author} entry that is missing a \code{family} entry.
\item \strong{\code{info_source_missing}}: Measures with an entry in its \code{source} entry that is missing a
required entry (\code{name} and/or \code{date_accessed}).
\item \strong{\code{info_source_*}}: Measures with an entry (\code{*}) in its \code{source} entry that is a
list (where they should all be strings).
\item \strong{\code{info_citation}}: Measures with a \code{citation} entry that cannot be found in any
\code{_references} entries across measure info files within the repository.
\item \strong{\code{info_layer_source}}: Measures with an entry in its \code{layer} entry that is missing a
\code{source} entry.
\item \strong{\code{info_layer_source_url}}: Measures with an entry in its \code{layer} entry that has a list
\code{source} entry that is missing a \code{url} entry. \code{source} entries can either be a string containing a
URL, or a list with a \code{url} entry.
\item \strong{\code{info_layer_filter}}: Measures with an entry in its \code{layer} entry that has a \code{filter}
entry that is missing required entries (\code{feature}, \code{operator}, and/or \code{value}).
}
or relating to data files with \strong{warnings}:
\itemize{
\item \strong{\code{warn_compressed}}: Files that do not have compression extensions
(\code{.gz}, \code{.bz2}, or \code{.xz}).
\item \strong{\code{warn_blank_colnames}}: Files with blank column names (often due to saving files with row names).
\item \strong{\code{warn_value_nas}}: Files that have \code{NA}s in their \code{value} columns; \code{NA}s here
are redundant with the tall format, and so, should be removed.
\item \strong{\code{warn_double_ints}}: Variable names that have an \code{int} type, but with values that have
remainders.
\item \strong{\code{warn_small_percents}}: Variable names that have a \code{percent} type, but that are all under
\code{1} (which are assumed to be raw proportions).
\item \strong{\code{warn_small_values}}: Variable names with many values (over 40\%) that are under \code{.00001}, and
no values under \code{0} or over \code{1}. These values should be scaled in some way to be displayed reliably.
\item \strong{\code{warn_value_name_nas}}: Files that have \code{NA}s in their \code{name} column.
\item \strong{\code{warn_entity_info_nas}}: Files that have \code{NA}s in any of their \code{entity_info} columns.
\item \strong{\code{warn_dataset_nas}}: Files that have \code{NA}s in their \code{dataset} column.
\item \strong{\code{warn_time_nas}}: Files that have \code{NA}s in their \code{time} column.
\item \strong{\code{warn_id_nas}}: Files that have \code{NA}s in their \code{id} column.
\item \strong{\code{warn_scientific}}: Files with IDs that appear to have scientific notation (e.g., \code{1e+5});
likely introduced when the ID column was converted from numbers to characters -- IDs should always be saved as
characters.
\item \strong{\code{warn_bg_agg}}: Files with IDs that appear to be census block group GEOIDs,
that do not include their tract parents (i.e., IDs consisting of 12 digits, and there are no IDs consisting of
their first 11 digits). These are automatically aggregated by \code{\link{site_build}}, but they should
be manually aggregated.
\item \strong{\code{warn_tr_agg}}: Files with IDs that appear to be census tract GEOIDs,
that do not include their county parents (i.e., IDs consisting of 11 digits, and there are no IDs consisting of
their first 5 digits). These are automatically aggregated by \code{\link{site_build}}, but they should
be manually aggregated.
\item \strong{\code{warn_missing_info}}: Measures in files that do not have a corresponding \code{measure_info.json}
entry. Sometimes this happens because the entry includes a prefix that cannot be derived from the file name
(which is the part after a year, such as \code{category} from \code{set_geo_2015_category.csv.xz}).
It is recommended that entries not include prefixes, and that measure names be specific
(e.g., \code{category_count} rather than \code{count} with a \code{category:count} entry).
}
or relating to data files with \strong{failures}:
\itemize{
\item \strong{\code{fail_read}}: Files that could not be read in.
\item \strong{\code{fail_rows}}: Files containing no rows.
\item \strong{\code{fail_time}}: Files with no \code{time} column.
\item \strong{\code{fail_idlen_county}}: Files with "county" \code{dataset}s with corresponding IDs
that are not consistently 5 characters long.
\item \strong{\code{fail_idlen_tract}}: Files with "tract" \code{dataset}s with corresponding IDs
that are not consistently 11 characters long.
\item \strong{\code{fail_idlen_block_group}}: Files with "block group" \code{dataset}s with corresponding IDs
that are not consistently 12 characters long.
}
}
\description{
Performs a series of checks to see if data in a given repository can be ingested by a datacommons project.
}
\examples{
\dontrun{
# from a data repository
check_repository()

# to automatically fix most warnings
check_repository(attempt_repair = TRUE)
}
}
