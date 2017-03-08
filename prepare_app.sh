#!/bin/bash

# set properties
source properties.sh

cp -r www/* build/$APP_NAME/www/

# go to build dir
cd build/$APP_NAME

# prepare project (this is required if you want to run the project from Xcode)
cordova prepare $PLATFORM

# go to root dir
cd ../..