#!/bin/bash

set -ex

SCRIPT_FOLDER=`dirname "$0"`
UTIL_FOLDER="$SCRIPT_FOLDER/util"

source $UTIL_FOLDER/jdl_util.sh

cd ./sample-output/$1
skipClient=`jdlVal "./$1.jdl" "skipClient"`

if [ "$skipClient" == "true" ]; then
    echo "Nothing to do.  Client was skipped."
else
    npm install

    clientFramework=`jdlVal "./$1.jdl" "clientFramework"`

    echo "Running $clientFramework client tests for $1..."

    if [ "$clientFramework" == "angularX" ]; then
        npm run lint
        npm run test
    else
        npm run test-ci
    fi
fi

cd ../../
