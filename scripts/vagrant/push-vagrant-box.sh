#!/bin/bash

BASEDIR=$(dirname $0)
vagrant up
$BASEDIR/make-vagrant-box.sh /tmp/lsionic.box
$BASEDIR/upload-vagrant-box.sh /tmp/lsionic.box

