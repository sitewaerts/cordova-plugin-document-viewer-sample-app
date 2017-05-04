Sample App for SitewaertsDocumentViewer Plugin
============================

Sample app for https://github.com/sitewaerts/cordova-plugin-document-viewer.

## Requirements ##

* iOS 6+
* Android 4.1+
* Windows 8.1
* Cordova/Phonegap >=3.7.0

## Installing Cordova ##

https://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-Line%20Interface


## Building the app ##

Check out the sample app and the viewer plugin to the same base directory
```
git clone https://github.com/sitewaerts/cordova-plugin-document-viewer-sample-app.git
git clone https://github.com/sitewaerts/cordova-plugin-document-viewer.git
```

### Windows (configured for Android or Windows development) ###

JAVA_HOME should point to a jdk 1.8 directory.

Open a command prompt and go to the directory where you checked out the projects
```
cd cordova-plugin-document-viewer-sample-app
create_app.bat
run_app.bat
```

Whenever you change something in the app or the plugin sources:
```
update_app.bat
run_app.bat
```

### OSX (configured for iOS and Android development) ###

same as above with .sh instead of .bat files

you may have to execute "chmod +x [filename]" for each of the scripts first


### Running and Debugging via IDE ###

If you want to run the app from an IDE like Xcode/Eclipse/VisualStudio but work on html/js/css in root www directory:

1. create_app.sh|bat (only once)
2. update_app.sh|bat (this reinstalls the linked plugins)
3. prepare_app.sh|bat (this migrates src changes in project root to the folders in the IDE project)
4. run App from IDE
