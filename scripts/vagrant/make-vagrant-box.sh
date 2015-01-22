#/bin/bash

if [ '' == "$1" ]; then
  echo 'You need input the path of output package.'
  exit
fi

echo 'sudo ~/vagrant-clean.sh' |vagrant ssh
vagrant package --output $1
