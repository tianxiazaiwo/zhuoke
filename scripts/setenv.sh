#!/bin/sh
ORIG_SUDO="" #"sudo -u `logname`"

if [ '' == `which node` ]; then
  echo 'You need nodejs installed.';
  exit;
fi

if [ '' == `which npm` ]; then
  echo 'You need npm installed.';
  exit;
fi

(
  cd vendor
  (
    echo 'Installing customed cordova-lib...'
    cd cordova-lib/cordova-lib
    $ORIG_SUDO npm install
    npm link
  )
  (
    echo 'Installing customed cordova...'
    cd cordova
    echo `readlink /usr/local/lib/node_modules/cordova`;
    if [ "`readlink /usr/local/lib/node_modules/cordova`" != "`pwd -P`" ]; then
      $ORIG_SUDO npm install
    fi
    npm link
    if [ ! -f node_modules/plugman ]; then
      $ORIG_SUDO npm install plugman
    fi
    $ORIG_SUDO npm link cordova-lib
  )
)

if [ '' == "`which bower`" ]; then
  echo 'Installing bower...'
  npm install -g bower
else
  echo 'bower installed.'
fi

if [ '' == "`which gulp`" ]; then
  echo 'Installing gulp...'
  npm install -g gulp
else
  echo 'gulp installed.'
fi

if [ '' == "`which mod`" ]; then
  echo 'Installing modjs...'
  npm install -g modjs
else
  echo 'modjs installed.'
fi

if [ '' == "`which ionic`" ]; then
  echo 'Installing ionic...'
  npm install -g ionic
else
  echo 'ionic installed.'
fi

npm link gulp gulp-concat  gulp-minify-css  gulp-rename  gulp-sass gulp-streamify gulp-packer lodash  minimist  semver  through shelljs q
npm install -g minify
