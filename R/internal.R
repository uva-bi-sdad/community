init_package <- function(name = "package", dir = ".") {
  dir.create(paste0(dir, "/", name, "/R"), FALSE, TRUE)
  dir.create(paste0(dir, "/", name, "/inst/specs"), FALSE, TRUE)
  dir.create(paste0(dir, "/", name, "/tests/testthat"), FALSE, TRUE)
}

parse_rule <- function(condition) {
  comb_type <- grepl("|", condition, fixed = TRUE)
  conds <- strsplit(gsub("\\s*([&|><=]+|!=+)\\s*", " \\1 ", gsub("=+", "=", condition)), " [&|]+ ")[[1]]
  lapply(conds, function(co) {
    co <- strsplit(co, "\\s")[[1]]
    if (length(co) == 1) co <- c(sub("^!+", "", co), if (grepl("^!\\w", co)) "!" else "", "")
    if (tolower(co[2]) %in% c("true", "false")) {
      list(
        id = co[1],
        type = if (tolower(co[2]) == "true") "" else "!",
        value = ""
      )
    } else {
      list(
        id = co[1],
        type = co[2],
        value = if (grepl("^\\d+$", co[3])) {
          as.numeric(co[3])
        } else {
          gsub("[\"']", "", co[3])
        },
        any = comb_type
      )
    }
  })
}

process_conditions <- function(conditions, ids, caller) {
  for (i in seq_along(conditions)) {
    if (conditions[i] != "") {
      display <- TRUE
      if (grepl("^[dl][^:]*:", conditions[i], TRUE)) {
        if (grepl("^l", conditions[i], TRUE)) display <- FALSE
        conditions[i] <- sub("^[dl][^:]*:\\s*", "", conditions[i], TRUE)
      }
      caller$rules <- c(caller$rules, list(list(
        condition = parse_rule(conditions[i]),
        effects = if (display) list(display = ids[i]) else list(lock = ids[i])
      )))
    }
  }
}

to_input_row <- function(e) {
  c(
    '<div class="col">', e[2], "</div>",
    '<div class="col">', e[-c(1:2, length(e))], "</div>"
  )
}

make_build_environment <- function() {
  e <- new.env()
  attr(e, "name") <- "community_site_parts"
  e$site_build <- function(...) {}
  e$uid <- 0
  e
}

calculate_sha <- function(file, level) {
  if (Sys.which("openssl") != "") {
    tryCatch(
      strsplit(
        system2("openssl", c("dgst", paste0("-sha", level), shQuote(file)), TRUE), " ",
        fixed = TRUE
      )[[1]][2],
      error = function(e) ""
    )
  } else {
    ""
  }
}

head_import <- function(d, dir = ".") {
  if (!is.null(d$src) && (!d$src %in% c("script.js", "style.css") || (file.exists(paste0(dir, "/docs/", d$src)) &&
    file.size(paste0(dir, "/docs/", d$src))))) {
    paste(c(
      "<", if (d$type == "script") 'script type="application/javascript" src="' else 'link href="', d$src, '"',
      if (!is.null(d$hash)) c(' integrity="', d$hash, '"', ' crossorigin="anonymous"'),
      if (d$type == "stylesheet") {
        c(
          ' rel="', if (!is.null(d$loading)) d$loading else "preload", '" as="style" media="all"',
          ' onload="this.onload=null;this.rel=\'stylesheet\'"'
        )
      },
      if (d$type == "script") c(" ", if (!is.null(d$loading)) d$loading else "async"), ">", if (d$type == "script") "</script>"
    ), collapse = "")
  }
}

make_full_name <- function(filename, variable) {
  sub("^:", "", paste0(sub(
    "^.*[\\\\/]", "",
    gsub("^.*\\d{4}(?:q\\d)?_|\\.\\w{3,4}(?:\\.[gbx]z2?)?$|\\..*$", "", basename(filename))
  ), ":", variable))
}

replace_equations <- function(info) {
  lapply(info, function(e) {
    descriptions <- grep("description", names(e), fixed = TRUE)
    if (length(descriptions)) {
      for (d in descriptions) {
        p <- gregexec(
          "(?:\\$|\\\\\\[|\\\\\\(|\\\\begin\\{math\\})(.+?)(?:\\$|\\\\\\]|\\\\\\)|\\\\end\\{math\\})(?=\\s|$)",
          e[[d]], perl = TRUE
        )[[1]]
        if (length(p) > 1) {
          ml <- attr(p, "match.length")
          re <- paste("", e[[d]], "")
          for (i in seq_len(ncol(p))) {
            mp <- p[2, i]
            eq <- substring(e[[d]], mp, mp + ml[2, i] - 1)
            parsed <- tryCatch(katex_mathml(eq), error = function(e) NULL)
            if (!is.null(parsed)) {
              mp <- p[1, i]
              re <- paste(
                strsplit(re, substring(e[[d]], mp, mp + ml[1, i] - 1), fixed = TRUE)[[1]],
                collapse = sub("^<[^>]*>", "", sub("<[^>]*>$", "", parsed))
              )
            }
          }
          e[[d]] <- gsub("^ | $", "", re)
        }
      }
    }
    e
  })
}
