#!/usr/bin/env node

var exec = require('child_process').exec;
var fs = require('fs');
var platform = process.env.CORDOVA_PLATFORMS;

exec('gulp jsmin-' + platform, function(err, stdout, stderr) {
  exec('rm -rf build');
});
