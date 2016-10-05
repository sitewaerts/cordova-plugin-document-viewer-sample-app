call properties.bat

xcopy www build\%APP_NAME%\www  /S /E /Y /i

cd build\%APP_NAME%

call cordova prepare %PLATFORM%

cd ..\..


