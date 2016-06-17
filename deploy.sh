#!/usr/bin/env bash

echo "Deploying to the github page"

cp -r ./public ../
git checkout gh-pages

rm -rf ./*.html
rm -rf ./*.html
rm -rf ./*.css
rm -rf ./*.js
rm -rf ./*.map

cp -r ../public/* .
rm -rf ../public

git add .
git commit -m "Deploying...."
git push origin gh-pages

echo 'Done!'
