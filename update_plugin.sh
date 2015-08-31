#!/bin/bash

# set properties
source properties.sh

# copy new version of app to build dir
cp -R -f www build/$APP_NAME/

# go to build dir
cd build/$APP_NAME

# copy new version of plugin
cordova plugin rm $PLUGIN_ID
cordova plugin add $PLUGIN_URL

# go to root dir
cd ../..