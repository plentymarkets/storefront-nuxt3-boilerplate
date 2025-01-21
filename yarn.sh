#!/bin/bash

RED='\033[0;31m'
SET='\033[0m'

function display_help() {
  echo "Usage: $0 [option...]"
  echo
  echo "   -h, --help       Show this help message"
  echo "   -v, --version    Show script version"
  echo "   -f, --force      Force delete .yarnrc.yml without asking"
  echo
}

function display_version() {
  echo "1.0"
}

function delete_yarnrc() {
  if [ -f .yarnrc.yml ]; then
    if [ "$FORCE_DELETE" = true ]; then
      rm .yarnrc.yml
    else
      read -p "Do you really want to delete your current .yarnrc.yml? [Y/n] " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        rm .yarnrc.yml
      else
        exit 1
      fi
    fi
  fi
}

# Parse command line arguments
FORCE_DELETE=false
while [[ "$1" != "" ]]; do
  case $1 in
    -h | --help )
      display_help
      exit
      ;;
    -v | --version )
      display_version
      exit
      ;;
    -f | --force )
      FORCE_DELETE=true
      ;;
    * )
      echo "Invalid option: $1"
      display_help
      exit 1
  esac
  shift
done

# Main script
corepack enable
delete_yarnrc
yarn set version stable
yarn set version 4.5.3 --yarn-path
yarn config set nodeLinker node-modules
yarn config set npmScopes.plentymarkets.npmRegistryServer "https://registry.npmjs.org"
yarn config set npmScopes.plentymarkets.npmAlwaysAuth false
yarn
