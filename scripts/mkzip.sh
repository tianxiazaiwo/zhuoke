#!/bin/sh

if [ "$2" == '' ]; then
  VER='1'
else
  VER="$2"
fi;

if [ "$1" == '' ]; then
  TARGET='../lbs-ios/xcode/cn.ahurls.lbs/lbs/Resources/apps/dingcan.zip'
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
  cd platforms/ios/www
  rm -rf mock
  find .|grep .min.js$|xargs $SED -i 's/^.\+sourceMappingURL=.\+$//g'
  find .|grep .min.js.map|xargs rm
)
mkdir platforms/ios/_zip
cp -r  platforms/ios/www platforms/ios/_zip/dingcan.bundle
(cd platforms/ios/_zip; zip -r ../dingcan.zip .)
rm -rf platforms/ios/_zip
mv platforms/ios/dingcan.zip $TARGET
