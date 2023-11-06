#!/bin/bash

set -e

make build install bundle

rm -rf public
cp -r dist/ public/
