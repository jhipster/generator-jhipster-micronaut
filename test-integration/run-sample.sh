#!/bin/bash

set -ex

SCRIPT_FOLDER="test-integration/scripts/"

for file in `ls $SCRIPT_FOLDER/*.sh`; do
    echo "Running $file"
    bash -e "$file" $1
    if [ $? -ne 0 ]; then
        echo "$file Failed!"
        break
    else
        echo Done!
        sleep 4
    fi
done
