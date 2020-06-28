#!/bin/bash

set -ex

SCRIPT_FOLDER=`dirname "$0"`
UTIL_FOLDER="$SCRIPT_FOLDER/util"

source $UTIL_FOLDER/jdl_util.sh

cd ./sample-output/$1
buildTool=`jdlVal "./$1.jdl" "buildTool"`

echo "Building and containerizing $1 using $buildTool..."

if [ "$buildTool" == "maven" ]; then
    ./mvnw -ntp package -Pdev jib:dockerBuild -DskipTests
else
    ./gradlew -Pdev shadowJar jibDockerBuild
fi

cd ../../
