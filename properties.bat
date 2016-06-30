SET APP_NAME=PDFViewerSampleApp

SET PLUGIN_ID=de.sitewaerts.cordova.documentviewer
rem SET PLUGIN_URL=https://github.com/sitewaerts/cordova-plugin-document-viewer
rem SET PLUGIN_URL=../../../cordova-plugin-document-viewer
CALL :NORMALIZEPATH PLUGIN_URL "../cordova-plugin-document-viewer"
rem echo PLUGIN_URL : %PLUGIN_URL%
rem SET PLUGIN_URL="c:/dev/schauerte/pdf/cordova-plugin-document-viewer"


rem SET PLATFORM=android
rem SET CORDOVA_VERSION=3.7.0

SET PLATFORM=windows
SET CORDOVA_VERSION=4.4.0



:: ========== FUNCTIONS ==========
EXIT /B

:NORMALIZEPATH
  SET %1=%~dpfn2
  rem SET %1=%~dpnx2
  EXIT /B