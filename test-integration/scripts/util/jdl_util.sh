#!/bin/bash

function jdlVal() {
    FILE=$1
    KEY="$2"

    RESULT=`cat $FILE | grep "$KEY" | awk -F "$KEY " '{print $2}'`

    echo "$RESULT"

    return 0
}
