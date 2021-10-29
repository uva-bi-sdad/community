#' Add dynamic text to a website
#'
#' Adds a textual output based on the current state of input elements.
#'
#' @param text A vector of text to be parsed.
#' @param tag Tag name of the element containing the text.
#' @param id Unique ID of the output element.
#' @param class Class names to add to the output's element.
#' @examples
#' \dontrun{
#' output_text("Selection: input_a{{input_a}, }")
#' }
#' @return A character vector of the containing element of the text.
#' @export

output_text <- function(text, tag = "p", id = NULL, class = NULL) {
  caller <- parent.frame()
  building <- !is.null(attr(caller, "name")) && attr(caller, "name") == "community_site_parts"
  if (is.null(id)) id <- paste0("text", caller$uid)
  depends <- list()
  parsed <- list()
  for (i in seq_along(text)) {
    e <- text[[i]]
    parsed[[i]] <- list()

    # extracting expressions
    ex <- gsub("^\\{|\\}$", "", regmatches(e, gregexpr("\\{.*?\\}", e))[[1]])

    # extracting conditional expressions
    if (grepl("^\\?", e)) {
      if (grepl("^\\?\\{", e)) {
        parsed[[i]]$condition <- parse_rule(ex[1])
        ex <- ex[-1]
        e <- sub("^\\?\\{.*?\\}", "", e)
      } else {
        parsed[[i]]$condition <- parse_rule(paste(ex, collapse = " & "))
        e <- gsub("?", "", e, fixed = TRUE)
      }
    }
    for (d in unique(ex)) depends[[d]] <- ""

    # extracting buttons
    if (grepl("[", e, fixed = TRUE)) {
      rb <- regmatches(e, gregexpr("(?:\\([^)[]*?\\)|\\b\\w+?)?\\[.*?\\]", e))[[1]]
      if (length(rb)) {
        parsed[[i]]$button <- list()
        for (b in seq_along(rb)) {
          rbb <- rb[b]
          bid <- paste0("b", b)
          parsed[[i]]$button[[bid]] <- list(
            text = as.list(sub(
              "}", "", strsplit(gsub("^\\(|\\)?\\[.*$", "", rbb), "{", fixed = TRUE)[[1]],
              fixed = TRUE
            )),
            type = if (grepl("[r", rbb, fixed = TRUE)) "reset" else "update",
            target = gsub("^[^[]*\\[\\w\\s?|\\]$", "", rbb)
          )
          if (parsed[[i]]$button[[bid]]$target == "") {
            parsed[[i]]$button[[bid]]$target <- if (grepl("{", rbb, fixed = TRUE)) {
              gsub("^[^{].*\\{|\\}.*$", "", rbb)
            } else {
              sub("\\[.*$", "", rbb)
            }
          }
        }
        regmatches(e, gregexpr("(?:\\([^)[]*?\\)|\\b\\w+?)?\\[.*?\\]", e)) <- as.list(paste0(
          "_SPLT_", paste0("b", seq_along(rb)), "_SPLT_"
        ))
      }
    }

    parsed[[i]]$text <- Filter(nchar, strsplit(e, "[{}]|_SPLT_")[[1]])
  }
  r <- paste0(c(
    "<", tag, ' auto-type="text" id="', id, '"',
    ' class="auto-output', if (!is.null(class)) paste("", class), '"',
    "></", tag, ">"
  ), collapse = "")
  if (building) {
    caller$text[[id]] <- list(text = parsed, depends = depends)
    caller$content <- c(caller$content, r)
    caller$uid <- caller$uid + 1
  }
  r
}
