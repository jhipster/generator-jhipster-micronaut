#!/bin/bash

set -ex

echo "Generating $1..."

mkdir -p ./sample-output/$1

cp -v ./test-integration/samples/$1.jdl ./sample-output/$1/$1.jdl

cd ./sample-output/$1

mhipster import-jdl "$1.jdl" --no-insight --skip-checks --skip-install --skip-git

cd ../../
