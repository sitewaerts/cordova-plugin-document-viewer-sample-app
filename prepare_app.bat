call properties.bat

mkdir build
cd build
rmdir /S /Q %APP_NAME%
call cordova create %APP_NAME% "test.%APP_NAME%" "%APP_NAME%" --copy-from ../www
cd %APP_NAME%

call cordova plugin add org.apache.cordova.console
call cordova plugin add org.apache.cordova.device
call cordova plugin add org.apache.cordova.file@1.3.1
call cordova plugin add org.apache.cordova.file-transfer
call cordova plugin add %PLUGIN_URL%

call cordova platform add %PLATFORM%

cd ..\..


