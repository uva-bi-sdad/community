#' Initialize a Data Commons
#'
#' Initialize a project to keep track of separate dataset repositories and distributions.
#'
#' @param dir Path to the desired data commons directory.
#' @param name Name of the data commons.
#' @param repos A vector of repository names to add to \code{commons.json}.
#' @param default_user GitHub username to prepend to repository names if needed.
#' @param remote Name of the data commons' GitHub repository (\code{"username/reponame"}).
#' @param url URL of the data commons' monitor site; defaults to the GitHub Pages URL associated with \code{remote}
#' if provided (\code{"https://username.github.io/reponame"}).
#' @param refresh_after Logical; if \code{FALSE}, will not run \code{\link{datacommons_refresh}}
#' after initiating the project. Defaults to \code{TRUE} when first creating a data commons project.
#' @param overwrite Logical; if \code{TRUE}, will overwrite existing datacommons files in \code{dir}.
#' The included \code{.js} and \code{.sh} files are always rewritten, and if \code{name},
#' \code{repos}, or \code{default_user} is specified, \code{commons.json} will also be rewritten
#' regardless of \code{overwrite}.
#' @param serve Logical; if \code{TRUE}, will serve the \code{docs} directory.
#' @param host The IPv4 address to listen to if \code{serve} is \code{TRUE}; defaults to \code{"127.0.0.1"}.
#' @param port The port to listen on if \code{serve} is \code{TRUE}; defaults to 3000.
#' @param open_after Logical; if \code{TRUE}, will open the served monitor site in a browser after it is built.
#' @param verbose Logical; if \code{FALSE}, suppresses messages.
#' @details
#' The shell scripts included in the project's \code{scripts} directory can be used to retrieve
#' and update repositories over SSH.
#'
#' This will clone or pull repositories listed in \code{scripts/repos.txt}:
#' \code{sh scripts/get_repos.sh}
#'
#' This will add, commit, and push all changes in all repositories:
#' \code{sh scripts/update_repos.sh "commit message"}
#' @examples
#' \dontrun{
#' init_datacommons(
#'   "../datacommons",
#'   name = "Data Commons",
#'   remote = ""
#' )
#' }
#' @return Path to the datacommons directory.
#' @export

init_datacommons <- function(dir, name = "Data Commons", repos = NULL, default_user = "",
                             remote = NULL, url = NULL, refresh_after = FALSE, overwrite = FALSE, serve = FALSE,
                             host = "127.0.0.1", port = 3000, open_after = FALSE, verbose = interactive()) {
  if (missing(dir)) cli_abort('{.arg dir} must be speficied (e.g., dir = ".")')
  check <- check_template("datacommons", dir = dir)
  if (missing(refresh_after) && !check$exists) refresh_after <- TRUE
  dir <- normalizePath(paste0(dir, "/", check$spec$dir), "/", FALSE)
  dir.create(paste0(dir, "/repos"), FALSE, TRUE)
  dir.create(paste0(dir, "/manifest"), FALSE)
  dir.create(paste0(dir, "/cache"), FALSE)
  dir.create(paste0(dir, "/views"), FALSE)
  dir.create(paste0(dir, "/docs"), FALSE)
  dir.create(paste0(dir, "/scripts"), FALSE)
  paths <- paste0(dir, "/", c(
    "commons.json", "README.md", ".gitignore", "project.Rproj",
    "scripts/repos.txt", "scripts/get_repos.sh", "scripts/update_repos.sh",
    "docs/index.html", "docs/request.js"
  ))
  if (overwrite) unlink(paths, TRUE)
  if (
    file.exists(paths[5]) && (!length(repos) ||
      (file.exists(paths[1]) && file.mtime(paths[5]) > file.mtime(paths[1])))
  ) {
    repos <- readLines(paths[5], warn = FALSE)
  }
  if (file.exists(paths[1])) {
    existing <- read_json(paths[1])
    if (missing(name)) name <- existing$name
    if (!length(repos)) repos <- existing$repositories
  }
  if (length(repos)) {
    if (default_user != "") repos <- paste0(default_user, "/", repos)
    repos <- unlist(regmatches(repos, regexec("[^/]+/[^/#@]+$", repos)), use.names = FALSE)
  }
  write_json(list(name = name, repositories = repos), paths[1], pretty = TRUE, auto_unbox = TRUE)
  if (!file.exists(paths[2])) {
    writeLines(c(
      paste("#", name),
      "",
      "Consists of the repositories listed in [commons.json](commons.json).",
      "",
      "You can clone this repository and run these commands to establish and work from local data:",
      "```R",
      '# remotes::install_github("uva-bi-sdad/community")',
      "library(community)",
      "",
      "# clone and/or pull repositories and distributions:",
      'datacommons_refresh(".")',
      "",
      "# map files:",
      'datacommons_map_files(".")',
      "",
      "# refresh a view (rebuild a view's site data):",
      'datacommons_view(".", "view_name")',
      "",
      "# run the monitor site locally:",
      'init_datacommons(".", serve = TRUE)',
      "```",
      ""
    ), paths[2])
  }
  if (!file.exists(paths[3])) {
    writeLines(c(
      ".Rproj.user",
      ".Rhistory",
      ".Rdata",
      ".httr-oauth",
      ".DS_Store",
      "*.Rproj",
      "node_modules",
      "package-lock.json",
      "repos",
      "cache",
      "docs/dist",
      ""
    ), paths[3])
  }
  if (!file.exists(paths[4]) && !any(grepl("\\.Rproj$", list.files(dir)))) {
    writeLines("Version: 1.0\n", paths[4])
  }
  writeLines(if (length(repos)) Filter(nchar, repos) else "", paths[5])
  writeLines(c(
    "#!/bin/bash",
    'script_dir="$(dirname "$(realpath "$0")")"',
    'repos_dir="$(dirname "$script_dir")/repos/"',
    "while read repo",
    "do",
    '  repo="${repo%$\'\\r\'}"',
    '  repo_path="$repos_dir""$(basename "$repo")"',
    '  if [[ -d "$repo_path" ]]',
    "  then",
    '    echo "pulling "$repo""',
    '    cd "$repo_path"',
    "    git pull",
    "  else",
    '    echo "cloning "$repo""',
    '    cd "$repos_dir"',
    '    git clone "git@github.com:""$repo"".git"',
    "  fi",
    '  cd "$script_dir"',
    'done < ""$(dirname "$0")"/repos.txt"',
    ""
  ), paths[6])
  writeLines(c(
    "#!/bin/bash",
    'if [[ -z "$1" ]]',
    "then",
    '  echo "provide a commit message as the first argument"',
    "else",
    '  read -r -p "Are you sure you want to commit and push all changes in all repositories? (y/N): "',
    '  if [[ "$REPLY" =~ ^[Yy] ]]',
    "  then",
    '    repo_dir="$(dirname "$(dirname "$(realpath "$0")")")/repos/"',
    '    for repo in "$repo_dir"*',
    "    do",
    '      echo "updating "$(basename "$repo")""',
    '      cd "$repo"',
    "      git add -A",
    '      git commit -m "$1"',
    "      git push",
    "    done",
    "  fi",
    "fi",
    ""
  ), paths[7])
  manifest_files <- paste0(dir, "/manifest/", c("repos", "files"), ".json")
  writeLines(c(
    "<!doctype html>",
    '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">',
    "<head>",
    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
    '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />',
    '<meta name="viewport" content="width=device-width,initial-scale=1" />',
    "<title>Data Commons Monitor</title>",
    '<meta name="description" content="Data commons monitoring site.">',
    unlist(lapply(list(
      list(type = "stylesheet", src = "https://uva-bi-sdad.github.io/community/dist/css/datacommons.min.css"),
      list(type = "script", src = "https://uva-bi-sdad.github.io/community/dist/js/datacommons.min.js"),
      list(
        type = "stylesheet",
        src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
        hash = "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
      ),
      list(
        type = "script",
        src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
        hash = "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
      )
    ), head_import, dir = dir)),
    paste0('<meta name="generator" content="community v', packageVersion("community"), '" />'),
    paste(c(
      '<script type="text/javascript">',
      "var commons",
      paste0(
        "window.onload = function(){commons = new DataCommons(",
        gsub("\\s+", "", paste0(readLines(paste0(dir, "/commons.json")), collapse = "")),
        ", {",
        "repos:", if (file.exists(manifest_files[1])) paste0(readLines(manifest_files[1]), collapse = "") else "{}",
        ",files:", if (file.exists(manifest_files[2])) paste0(readLines(manifest_files[2]), collapse = "") else "{}",
        "}, ",
        toJSON(Filter(length, lapply(
          list.dirs(paste0(dir, "/views"), FALSE)[-1], function(v) {
            f <- paste0(dir, "/views/", v, "/", "view.json")
            if (file.exists(f)) list(name = v, view = read_json(f))
          }
        )), auto_unbox = TRUE),
        ")}"
      ),
      "</script>"
    ), collapse = "\n"),
    "</head>",
    "<body>",
    '<div id="site_wrap" style="position: fixed; height: 100%; width: 100%">',
    page_navbar(
      title = paste(name, "Monitor"),
      input_button("check repos", id = "refresh_button")
    ),
    '<div class="content container-fluid">',
    "</div>",
    "</div>",
    '<noscript style="width: 100%; text-align: center; padding: 5em">Please enable JavaScript to view this site.</noscript>',
    "</body>",
    "</html>"
  ), paths[8])
  writeLines(c(
    "'use strict'",
    "onmessage = function(m){",
    "  const f = new XMLHttpRequest()",
    "  f.onreadystatechange = function () {",
    "    if (4 === f.readyState) {",
    "      m.data.status = f.status",
    "      m.data.response = f.responseText",
    "      postMessage(m.data)",
    "    }",
    "  }",
    "  f.open('GET', m.data.url, true)",
    "  f.send()",
    "}",
    ""
  ), paths[9])
  if (verbose) {
    cli_bullets(c(
      v = paste(if (check$exists) "updated" else "created", "{name}:"),
      "*" = paste0("{.path ", normalizePath(dir, "/", FALSE), "}"),
      i = if (!length(repos)) {
        paste0(
          "add repository names to {.file commons.json} or {.file scripts/repos.txt}, then use ",
          '{.code datacommons_refresh("', dir, '")} to clone them'
        )
      }
    ))
  }
  if (refresh_after && length(repos)) datacommons_refresh(dir, verbose = verbose)
  if (serve) site_start_server(dir, host, port, open_after)
  invisible(dir)
}
