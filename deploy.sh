#!/usr/bin/env bash

echo "Deploying to the github page"

cp -r ./public ../
git checkout gh-pages
rm -rf ./*
cp -r ../public/* .
rm -rf ../public

echo 'Done!'
