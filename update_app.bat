call properties.bat

copy /Y www\* build\%APP_NAME%\www

cd build\%APP_NAME%

call cordova plugin rm %PLUGIN_ID%
call cordova plugin add %PLUGIN_URL%

cd ..\..
