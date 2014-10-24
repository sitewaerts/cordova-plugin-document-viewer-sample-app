#!/bin/bash

# set properties
source properties.sh

# go to build dir
cd build/$APP_NAME

# build project (this is required if you want to run the project from Xcode)
cordova build $PLATFORM

# go to root dir
cd ../..