SET APP_NAME=PDFViewerSampleApp

SET PLUGIN_ID=cordova-plugin-document-viewer
@rem SET PLUGIN_URL=https://github.com/sitewaerts/cordova-plugin-document-viewer
@rem SET PLUGIN_URL=../../../cordova-plugin-document-viewer
CALL :NORMALIZEPATH PLUGIN_URL "../cordova-plugin-document-viewer"
echo PLUGIN_URL : %PLUGIN_URL%
@rem SET PLUGIN_URL="c:/dev/schauerte/pdf/cordova-plugin-document-viewer"


@rem SET PLATFORM=android
@rem SET CORDOVA_VERSION=6.4.0

SET PLATFORM=windows
SET CORDOVA_VERSION=7.0.1



:: ========== FUNCTIONS ==========
EXIT /B

:NORMALIZEPATH
  SET %1=%~dpfn2
  rem SET %1=%~dpnx2
  EXIT /B
