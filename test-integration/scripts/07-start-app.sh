#!/bin/bash

set -x

SCRIPT_FOLDER=`dirname "$0"`
UTIL_FOLDER="$SCRIPT_FOLDER/util"

source $UTIL_FOLDER/jdl_util.sh

cd ./sample-output/$1
testFrameworks=`jdlVal "./$1.jdl" "testFrameworks"`

function verifyAppAvailable() {
    serverPort="$1"

    retryCount=1
    maxRetry=10
    httpUrl="http://localhost:$serverPort"

    rep=$(curl -v "$httpUrl")
    status=$?
    while [ "$status" -ne 0 ] && [ "$retryCount" -le "$maxRetry" ]; do
        echo "*** [$(date)] Application not reachable yet. Sleep and retry - retryCount =" $retryCount "/" $maxRetry
        retryCount=$((retryCount+1))
        sleep 10
        rep=$(curl -v "$httpUrl")
        status=$?
    done

    if [ "$status" -ne 0 ]; then
        echo "*** [$(date)] Not connected after" $retryCount " retries."
        return 1
    fi
}

if [[ "$testFrameworks" == *"protractor"* ]]; then
    buildTool=`jdlVal "./$1.jdl" "buildTool"`
    appName=`jdlVal "./$1.jdl" "baseName"`
    serverPort=`jdlVal "./$1.jdl" "serverPort"`

    jarFile="target/$appName-0.0.1-SNAPSHOT.jar"

    if [ "$buildTool" == "gradle" ]; then
        jarFile="build/libs/$appName-0.0.1-SNAPSHOT-all.jar"
    fi

    java -jar "$jarFile" &

    sleep 10

    verifyAppAvailable "$serverPort"

    result=$?

    if [ $result -ne 0 ]; then
        exit $result
    fi
else
    echo "Protractor is not being used in this sample"
fi

cd ../../
