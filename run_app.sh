#!/bin/bash

# set properties
source properties.sh

# go to build dir
cd build/$APP_NAME

# run app in emulator
cordova run $PLATFORM

# go to root dir
cd ../..