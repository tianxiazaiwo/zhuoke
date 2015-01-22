#!/bin/sh

if [ "$2" == '' ]; then
  VER='1'
else
  VER="$2"
fi;

if [ "$1" == '' ]; then
  TARGET='../lbs-android/android/apps/cn.ahurls.lbs/assets/apps/dingcan.obb'
else
  TARGET=$1
fi

if which gsed; then
  SED=gsed
else
  SED=sed
fi

find . -name .DS_Store|xargs rm
(
  cd platforms/android/assets/www
  rm -rf mock
  find .|grep .min.js$|xargs $SED -i 's/^.\+sourceMappingURL=.\+$//g'
  find .|grep .min.js.map|xargs rm
)
vagrant ssh -c "cd ~/Code/m/shequ;/android-sdk/tools/jobb -pv $VER -pn cn.ahurls.lbs -d platforms/android/assets/www/ -o dingcan.obb"
mv dingcan.obb $TARGET
