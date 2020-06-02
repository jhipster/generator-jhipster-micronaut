#!/bin/bash

set -ex

SCRIPT_FOLDER=`dirname "$0"`
UTIL_FOLDER="$SCRIPT_FOLDER/util"

source $UTIL_FOLDER/jdl_util.sh

cd ./sample-output/$1
testFrameworks=`jdlVal "./$1.jdl" "testFrameworks"`
authType=`jdlVal "./$1.jdl" "authenticationType"`
devDb=`jdlVal "./$1.jdl" "devDatabaseType"`

if [[ "$testFrameworks" == *"protractor"* ]]; then
    if [ "$authType" == "oauth2" ]; then
        docker-compose -f src/main/docker/keycloak.yml pull
        docker-compose -f src/main/docker/keycloak.yml up -d
    fi

    if [ -f "src/main/docker/$devDb.yml" ]; then
        docker-compose -f src/main/docker/$devDb.yml pull
        docker-compose -f src/main/docker/$devDb.yml up -d
    fi

    docker ps -a
    docker image ls
else
    echo "Protractor is not being used in this sample"
fi

cd ../../
