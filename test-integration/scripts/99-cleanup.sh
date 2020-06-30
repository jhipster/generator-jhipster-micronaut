#!/bin/bash

set -ex

mv backup.eslintrc.json .eslintrc.json
mv backup.yo-rc.json .yo-rc.json

rm -rf ./sample-output/

SCRIPT_FOLDER=`dirname "$0"`
UTIL_FOLDER="$SCRIPT_FOLDER/util"

source $UTIL_FOLDER/jdl_util.sh

cd ./sample-output/$1
testFrameworks=`jdlVal "./$1.jdl" "testFrameworks"`

if [[ "$testFrameworks" == *"protractor"* ]]; then
    docker-compose -f src/main/docker/app.yml down
else
    echo "Protractor is not being used in this sample"
fi

cd ../../

