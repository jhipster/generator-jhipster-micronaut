#!/bin/bash

echo "Moving around eslint configs..."
mv .eslintrc.json backup.eslintrc.json

if [ "$GITHUB_ACTIONS" == "true" ]; then
    echo "Detected within GitHub actions..."
    sudo apt-get update
    sudo apt-get install google-chrome-stable
fi

echo "Creating output folder..."

mkdir -p sample-output

echo "Linking MHipster..."

npm ci
npm link

echo "Environment:"

env

echo "Versions:"

java -version
node --version
npm --version
