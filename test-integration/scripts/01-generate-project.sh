#!/bin/bash

set -ex

echo "Generating $1..."

mkdir -p ./sample-output/$1

cp -v ./test-integration/samples/$1.yo-rc.json ./sample-output/$1/.yo-rc.json

cd ./sample-output/$1

mhipster --no-insight --skip-checks --skip-install --force --with-entities

cd ../../
