call properties.bat

pushd build\%APP_NAME%
call cordova run %PLATFORM%
popd

