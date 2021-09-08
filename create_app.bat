call properties.bat

mkdir build
pushd build
if exist "%APP_NAME%\" rd /S /Q %APP_NAME%
call cordova create %APP_NAME% "test.%APP_NAME%" "%APP_NAME%" --template ../app-template

if not exist "%APP_NAME%\" echo "cannot create cordova app" && goto end

pushd %APP_NAME%

rem call cordova plugin add cordova-plugin-console
call cordova plugin add cordova-plugin-device
call cordova plugin add cordova-plugin-dialogs
call cordova plugin add cordova-plugin-file
call cordova plugin add cordova-plugin-file-transfer
rem call cordova plugin add ../../../../pg-plugins/cordova-plugin-file-transfer
call cordova plugin add %PLUGIN_URL%

call cordova platform add %PLATFORM%@%CORDOVA_VERSION%

popd
popd


:end

