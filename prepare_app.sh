#!/bin/bash

# set properties
source properties.sh

# create build dir
mkdir build

# go to build dir
cd build

# remove old app dir
rm -r $APP_NAME

# recreate app
cordova create $APP_NAME "test.$APP_NAME" "$APP_NAME" --copy-from ../www

# go to app dir
cd $APP_NAME

# add plugins
cordova plugin add org.apache.cordova.console
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.file@1.3.1
cordova plugin add org.apache.cordova.file-transfer
cordova plugin add $PLUGIN_URL

# add platform
cordova platform add $PLATFORM@$CORDOVA_VERSION

# go to root dir
cd ../..


