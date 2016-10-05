call properties.bat

mkdir build
cd build
rd /S /Q %APP_NAME%
call cordova create %APP_NAME% "test.%APP_NAME%" "%APP_NAME%" --template ../www
cd %APP_NAME%

call cordova plugin add cordova-plugin-console
call cordova plugin add cordova-plugin-device
call cordova plugin add cordova-plugin-dialogs
call cordova plugin add cordova-plugin-file
call cordova plugin add cordova-plugin-file-transfer
rem call cordova plugin add ../../../../pg-plugins/cordova-plugin-file-transfer
call cordova plugin add %PLUGIN_URL%

call cordova platform add %PLATFORM%@%CORDOVA_VERSION%

cd ..\..


