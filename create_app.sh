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
cordova create $APP_NAME "test.$APP_NAME" "$APP_NAME" --template ../www

# go to app dir
cd $APP_NAME

# add plugins
cordova plugin add cordova-plugin-console
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-file-transfer
cordova plugin add $PLUGIN_URL

# add platform
cordova platform add $PLATFORM@$CORDOVA_VERSION

# go to root dir
cd ../..


