#!/bin/bash

if [ '' == "$1" ]; then
  echo 'You need input the path of input package.'
  exit
fi

scp $1 kenny:~/sandbox/web/ionic-box.box
