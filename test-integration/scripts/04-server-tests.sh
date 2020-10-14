#!/bin/bash

set -ex

SCRIPT_FOLDER=`dirname "$0"`
UTIL_FOLDER="$SCRIPT_FOLDER/util"

source $UTIL_FOLDER/jdl_util.sh

cd ./sample-output/$1
buildTool=`jdlVal "./$1.jdl" "buildTool"`
skipClient=`jdlVal "./$1.jdl" "skipClient"`

echo "Running $buildTool server tests for $1..."

if [ "$buildTool" == "maven" ]; then
    ./mvnw -ntp clean verify
else
    if [ "$skipClient" == "true" ]; then
        ./gradlew test integrationTest
    else
        ./gradlew test integrationTest -x webpack -x webpackBuildDev
    fi
fi

cd ../../

