call properties.bat

xcopy www build\%APP_NAME%\www  /S /E /Y

cd build\%APP_NAME%

call cordova plugin rm %PLUGIN_ID%
call cordova plugin add %PLUGIN_URL%

cd ..\..
