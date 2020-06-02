#!/bin/bash

set -e

if [ -d "./test-integration/samples/fixes/$1" ]; then
    echo "$1 needs a manual fix!!"
    echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    echo "WARNING: Applying fixes so that something will work!!   ="
    echo "WARNING: There should be an issue reference in these    ="
    echo "WARNING: files that expain why they are needed and when ="
    echo "WARNING: they can be removed!!!!                        ="
    echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="

    cp -a -v ./test-integration/samples/fixes/$1/* ./sample-output/$1/
else
    echo "$1 does not require any fixes.  Hooray!"
fi
