#!/bin/bash

set -ex

echo "Creating output folder"

mkdir -p sample-output

echo "Linking MHipster..."

npm ci
npm link
