#!/bin/bash

vagrant halt
VBoxManage unregistervm --delete `cat .vagrant/machines/default/virtualbox/id`
rm -rf .vagrant
vagrant box remove wanjia/ionic
vagrant box add --force wanjia/ionic http://sandbox.guxy.365jia.lab/ionic-box.box
vagrant up
