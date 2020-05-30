#!/bin/bash

set -ex

SCRIPT_FOLDER=`dirname "$0"`
UTIL_FOLDER="$SCRIPT_FOLDER/util"

source $UTIL_FOLDER/jdl_util.sh

cd ./sample-output/$1
buildTool=`jdlVal "./$1.jdl" "buildTool"`

echo "Running $buildTool server tests for $1..."

if [ "$buildTool" == "maven" ]; then
    ./mvnw clean test integration-test
else
    ./gradlew clean test integrationTest -x webpack -x webpackBuildDev --stacktrace --info
fi

cd ../../

