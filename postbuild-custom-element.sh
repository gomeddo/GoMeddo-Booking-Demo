#!/usr/bin/env sh

shopt -s extglob

rm build/!(asset-manifest.json|static|index.html|style.css)

if [ "$1" = "debug" ]; then
  yarn prettier -w build/index.html

  sed -i '' '/main\..*\.css/d' build/index.html
  sed -i '' '/rel="manifest"/d' build/index.html
  sed -i '' '/rel="apple-touch-icon"/d' build/index.html
  sed -i '' '/rel="icon"/d' build/index.html
  sed -i '' 's/\<div id="sales-appointment" .*>\<\/div>/<sales-appointment class="app" \/>/g' build/index.html
else
  rm build/{index.html,style.css}
fi
