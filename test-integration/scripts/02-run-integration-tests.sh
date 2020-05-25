#!/bin/bash

set -ex

cd ./sample-output/$1
buildTool=`cat .yo-rc.json | jq -r '.["generator-jhipster"]'.buildTool`

echo "Running $buildToold integration tests for $1..."

if [ "$buildTool" == "maven" ]; then
    ./mvnw clean integration-test
else
    ./gradlew clean test integrationTest
fi



