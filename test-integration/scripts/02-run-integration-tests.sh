#!/bin/bash

set -ex

echo "Running integration tests for $1..."

cd ./sample-output/$1

./mvnw clean integration-test
