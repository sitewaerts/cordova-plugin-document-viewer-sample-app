#!/bin/bash

# set properties
source properties.sh

# go to build dir
cd build/$APP_NAME

# prepare project (this is required if you want to run the project from Xcode)
for p in "${PLATFORMS[@]}"
do
	cordova prepare $p
done

# go to root dir
cd ../..