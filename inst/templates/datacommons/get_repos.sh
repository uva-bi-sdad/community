#!/bin/bash
script_dir="$(dirname "$(realpath "$0")")"
repos_dir="$(dirname "$script_dir")/repos/"
while read repo
do
  repo="${repo%$'\r'}"
  repo_path="$repos_dir""$(basename "$repo")"
  if [[ -d "$repo_path" ]]
  then
    echo "pulling "$repo""
    cd "$repo_path"
    git pull
  else
    echo "cloning "$repo""
    cd "$repos_dir"
    git clone "git@github.com:""$repo"".git"
  fi
  cd "$script_dir"
done < ""$(dirname "$0")"/repos.txt"

