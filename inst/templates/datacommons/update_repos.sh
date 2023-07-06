#!/bin/bash
if [[ -z "$1" ]]
then
  echo "provide a commit message as the first argument"
else
  read -r -p "Are you sure you want to commit and push all changes in all repositories? (y/N): "
  if [[ "$REPLY" =~ ^[Yy] ]]
  then
    repo_dir="$(dirname "$(dirname "$(realpath "$0")")")/repos/"
    for repo in "$repo_dir"*
    do
      echo "updating "$(basename "$repo")""
      cd "$repo"
      git add -A
      git commit -m "$1"
      git push
    done
  fi
fi

