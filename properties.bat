SET APP_NAME=PDFViewerSampleApp

SET PLUGIN_ID=cordova-plugin-document-viewer
rem SET PLUGIN_URL=https://github.com/sitewaerts/cordova-plugin-document-viewer
rem SET PLUGIN_URL=../../../cordova-plugin-document-viewer
CALL :NORMALIZEPATH PLUGIN_URL "../cordova-plugin-document-viewer"
echo PLUGIN_URL : %PLUGIN_URL%
rem SET PLUGIN_URL="c:/dev/schauerte/pdf/cordova-plugin-document-viewer"


SET PLATFORM=android
SET CORDOVA_VERSION=6.2.3

rem SET PLATFORM=windows
rem SET CORDOVA_VERSION=4.4.3



:: ========== FUNCTIONS ==========
EXIT /B

:NORMALIZEPATH
  SET %1=%~dpfn2
  rem SET %1=%~dpnx2
  EXIT /B