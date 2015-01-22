#!/bin/sh
vagrant ssh -c "cd ~/Code/m/shequ;cordova prepare android ios"

DIR=$(dirname $0)
$DIR/mkzip.sh
$DIR/mkobb.sh
