#!/bin/bash

set -x

SCRIPT_FOLDER=`dirname "$0"`
UTIL_FOLDER="$SCRIPT_FOLDER/util"

source $UTIL_FOLDER/jdl_util.sh

cd ./sample-output/$1
testFrameworks=`jdlVal "./$1.jdl" "testFrameworks"`

function runE2e() {
    retryCount=0
    maxRetry=3
    until [ "$retryCount" -ge "$maxRetry" ]
    do
        result=0
        npm install
        npm run e2e -- --params.waitTimeoutInMillis=30000
        result=$?
        [ $result -eq 0 ] && break
        retryCount=$((retryCount+1))
        echo "*** e2e tests failed... retryCount =" $retryCount "/" $maxRetry
        sleep 15
    done
    return $result
}

if [[ "$testFrameworks" == *"protractor"* ]]; then
    runE2e
    result=$?
    if [ $result -ne 0 ]; then
        exit $result
    fi
else
    echo "Protractor is not being used in this sample"
fi

cd ../../
