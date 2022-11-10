#!/usr/bin/env sh

shopt -s extglob

if [ "$1" = "debug" ]; then
  yarn prettier -w build/index.html

  sed -i '' '/main\..*\.css/d' build/index.html
  sed -i '' 's/\<div id="sales-appointment"\>\<\/div\>/<sales-appointment><\/sales-appointment>/g' build/index.html
else
  rm build/!(asset-manifest.json|static)
fi
