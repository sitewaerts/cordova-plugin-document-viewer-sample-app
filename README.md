Sample App for SitewaertsDocumentViewer Plugin
============================

Sample app for https://github.com/sitewaerts/cordova-plugin-document-viewer.

**This project is currently under development and not yet ready to use.**

## Requirements ##

* iOS 6+
* Android 4.1+
* Cordova/Phonegap >=3.5.0

## Installing Cordova ##

https://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-Line%20Interface


## Building the app ##

Check out the sample app and the viewer plugin to the same base directory
```
git clone https://github.com/sitewaerts/cordova-plugin-document-viewer-sample-app.git
git clone https://github.com/sitewaerts/cordova-plugin-document-viewer.git
```

### Windows (configured for Android development) ###

Open a command prompt and go to the directory where you checked out the projects
```
cd cordova-plugin-document-viewer-sample-app
prepare_app.bat
run_app.bat
```

Whenever you change something in the app or the plugin sources:
```
update_app.bat
run_app.bat
```

### OSX (configured for iOS development) ###

same as above with .sh instead of .bat files

you may have to execute "chmod +x [filename]" for each of them first

if you run the app from xcode but work on html/js/css in root www directory:

1. update_app.sh (this reinstalls the linked plugins)
2. build_app.sh (this migrates changes in project root to the right folder in the Xcode project)
3. run from Xcode
