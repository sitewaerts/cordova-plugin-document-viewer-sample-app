// list files located in www folder here
var files = [
    'test01.pdf',
    'test01.docx',
    'test01_onepage.pdf',
    'test01_twopages.pdf',
    'test01_threepages.pdf',
    'test01_mixedpages.pdf',
    'test01_manypages.pdf',
    'test01_pdfwithlinks.pdf'];

files = files.concat([
    'private_fis_01.pdf',
    'private_fis_02.pdf',
    'private_fis_03.pdf',
    'private_fis_04.pdf',
    'private_fis_05.pdf',
    'private_fis_06.pdf',
    'private_fis_07.pdf',
    'private_drop.pdf'
]);


var autoCloseTimeoutSeconds = 0;



var _sdv;


var nativeAlert = window.alert;
function doAlert(msg, next)
{
    if (nativeAlert)
    {
        nativeAlert(msg);
        if (next)
            next();
    }
    else
    {
        navigator.notification.alert(msg, next);
    }
}
window.alert = doAlert;

function majorError(msg, e)
{
    window.console.error(msg, e);
    alert(msg + (e && e.message ? ": " + e.message : ""));
}

// define global viewer options here
var VIEWER_OPTIONS = {
    documentView: {
        closeLabel: "Fertig"
    },
    navigationView: {
        closeLabel: "Zurück"
    },
    email: {
        enabled: false
    },
    print: {
        enabled: true
    },
    openWith: {
        enabled: false
    },
    bookmarks: {
        enabled: false
    },
    search: {
        enabled: false
    },
    autoClose: {
        onPause: false
    }
};

function buildViewerOptions()
{
    var options = $.extend({}, VIEWER_OPTIONS);

    if (window["cordova"])
    {
        if (!options.android)
            options.android = {};
    }
    return options;
}


var baseUrl = location.href.replace("/index.html", "");

var defaultStorage = "assets";

var MIME_TYPES = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

var entries = {assets: {}, private: {}, shared: {}};


if (typeof String.prototype.contains === 'undefined')
{
    String.prototype.contains = function (str)
    {
        return this.indexOf(str) !== -1;
    };
}

if (typeof String.prototype.endsWith === 'undefined')
{
    String.prototype.endsWith = function (str)
    {
        if (!str)
            return false;
        return this.indexOf(str, this.length - str.length) !== -1;
    };
}

if (typeof String.prototype.startsWith === 'undefined')
{
    String.prototype.startsWith = function (str)
    {
        if (!str)
            return false;
        return this.indexOf(str, 0) === 0;
    };
}

function concatPath(base, uri)
{

    var result = base;
    if (result && !result.endsWith("/"))
        result = result + "/";
    if (uri && uri.startsWith("/"))
        uri = uri.substring(1);
    return result + uri;
}

function getPrivateAppDataRootDirEntry(success, error)
{
    if (!window["cordova"])
    {
        // browser
        success(null);
        return;
    }

    function dirFound(dir)
    {
        window.console.log(
                "returning "
                + path
                + " / "
                + dir.nativeURL
                + " / "
                + dir.toURL()
                + " as private data dir");
        success(dir);
    }

    if (window.cordova["file"])
    {
        // iOS, Android, Windows
        var path = cordova.file.dataDirectory;
        window.resolveLocalFileSystemURL(
                path,
                dirFound,
                error
        );
    }
    else
    {
        // windows
        // windows has no private but only shared data dir
        success(null);
    }
}

function getSharedAppDataRootDirEntry(success, error)
{
    if (!window["cordova"])
    {
        success(null);
        return;
    }

    function dirFound(dir)
    {
        window.console.log(
                "returning "
                + path
                + " / "
                + dir.nativeURL
                + " / "
                + dir.toURL()
                + " as shared data dir");
        success(dir);
    }

    if (window.cordova["file"])
    {

        // ios, Android

        var path = cordova.file.documentsDirectory; // iOS
        if (!path)
            path = cordova.file.externalDataDirectory; // Android

        window.resolveLocalFileSystemURL(
                path,
                dirFound,
                error
        );
    }
    else
    {
        // windows

        // windows has only shared data dir (never private)

        window.requestFileSystem(
                LocalFileSystem.PERSISTENT,
                0,
                function (fileSystem)
                {
                    window.console.log("got filesystem"
                            + ". location: "
                            + location.href);
                    dirFound(fileSystem.root);
                },
                function (e, details)
                {
                    window.console.error(e, details);
                    error(e, details);
                }
        );
    }
}

function errorHandler(e)
{
    majorError("error ", e);
    throw e;
}

function copyFiles(success, error)
{

    function copyFile(entries, dir, file, success)
    {
        function newFileCreated(entry)
        {
            var storageEntry = {
                url: entry.nativeURL,
                mimeType: getMimeType(file),
                entry: entry
            };
            setViewerSupport(storageEntry, function ()
            {
                entries[file] = storageEntry;
                success();
            });

        }


        var source = buildAssetsUrl(file);

        copyViaResolver();


        function copyViaResolver()
        {
            // not supported on windows: cannot resolveLocalFileSystemURL from ms-appx:// url (only app-data:// is supported)
            window.console.log("resolving source " + source);
            window.resolveLocalFileSystemURL(
                    source,
                    function (entry)
                    {
                        window.console.log("copying " + entry.toURL() + " to "
                                + concatPath(dir.toURL(), file));
                        entry.copyTo(dir, file, newFileCreated, error);
                    },
                    function (e)
                    {
                        window.console.error("cannot resolve source " + source,
                                e);
                        if (error)
                            error(e);
                    });
        }

        function copyViaFileTransfer()
        {
            // not supported on windows: cannot download from ms-appx:// url (only http, https and ftp supported)
            var ft = new FileTransfer();
            var dest = concatPath(dir.toURL(), file);
            window.console.log("transfering source " + source + " to " + dest);
            ft.download(
                    source,
                    dest,
                    newFileCreated,
                    error
            );
        }


    }

    function copyFiles(entries, dir, success)
    {

        function doIt(idx)
        {
            if (idx >= files.length)
            {
                success();
                return;
            }

            copyFile(entries, dir, files[idx], function ()
            {
                doIt(++idx);
            });
        }

        doIt(0);
    }

    function setViewerSupport(entry, next)
    {
        if (!_sdv)
        {
            entry.canView = null;
            next();
            return;
        }

        var options = buildViewerOptions();

        _sdv.canViewDocument(
                entry.url,
                entry.mimeType,
                options,
                function onPossible()
                {
                    entry.canView = true;
                    next();
                },
                function onMissingApp()
                {
                    entry.canView = true;
                    next();
                },
                function onImpossible()
                {
                    entry.canView = false;
                    next();
                },
                function onError(error)
                {
                    window.console.log(error);
                    entry.canView = false;
                    next();
                }
        );
    }

    function buildAssetEntries(success)
    {
        var myEntries = entries.assets;

        function doIt(idx)
        {
            if (idx >= files.length)
            {
                success();
                return;
            }

            var file = files[idx];
            var entry = {
                url: buildAssetsUrl(file),
                mimeType: getMimeType(file)
            };

            setViewerSupport(entry, function ()
            {
                myEntries[file] = entry;
                doIt(++idx);
            });
        }

        doIt(0);
    }


    function buildOtherEntries(success)
    {
        function buildPrivateDataDirEntries(next)
        {
            getPrivateAppDataRootDirEntry(
                    function (dir)
                    {
                        if (!dir)
                        {
                            window.console.log(
                                    "no private directory available");
                            next();
                        }
                        else
                        {
                            defaultStorage = "private";
                            copyFiles(entries.private, dir, next);
                        }
                    },
                    error
            );

        }

        function buildSharedDataDirEntries(next)
        {
            getSharedAppDataRootDirEntry(
                    function (dir)
                    {
                        if (!dir)
                        {
                            window.console.log("no shared directory available");
                            next();
                        }
                        else
                        {
                            defaultStorage = "shared";
                            copyFiles(entries.shared, dir, next);
                        }
                    },
                    error
            );

        }

        buildPrivateDataDirEntries(function ()
        {
            buildSharedDataDirEntries(success)
        });
    }

    buildAssetEntries(function ()
    {
        buildOtherEntries(success)
    });

}

function buildUrl(storage, file)
{
    if (file.indexOf('://') > 1)
        return file;

    var url = buildDataUrl(storage, file);
    if (url)
        return url;

    return buildAssetsUrl(file);
}

function buildDataUrl(storage, file)
{
    storage = storage || defaultStorage;
    var entry = entries[storage][file];
    if (entry)
        return entry.url;
    return null;
}

function buildAssetsUrl(file)
{
    return baseUrl + "/" + file;
}

function getMimeType(file)
{
    var suffix = file.split('.').pop();
    return MIME_TYPES[suffix];
}

function createDocumentOpener(file, storage)
{
    return function ()
    {
        return openDocument(file, storage)
    };
}

function openDocument(file, storage)
{
    var url = buildUrl(storage, file);
    var mimeType = entries[storage][file].mimeType;
    viewDocument(url, mimeType, storage);
}

function clickUri(uri)
{
    viewDocument(uri, getMimeType(uri), 'click');
}

function viewDocument(url, mimeType, storage)
{
    if (!_sdv)
    {
        window.console.log("Attempting to view '" + url + "'");
        window.open(url);
        return false;
    }

    alert("Attempting to view '" + url + "'", view);


    function view()
    {
        var _autoClose;

        function onShow()
        {
            $('body').addClass('viewer_open');
            // shown
            window.console.log('document shown');

            if (autoCloseTimeoutSeconds > 0)
            {
                _autoClose = setTimeout(
                        function ()
                        {
                            _autoClose = null;
                            _sdv.closeDocument();
                        }, autoCloseTimeoutSeconds * 1000);
            }
        }

        function onClose()
        {
            if (_autoClose)
            {
                clearTimeout(_autoClose);
                _autoClose = null;
            }

            $('body').removeClass('viewer_open');
            // closed
            window.console.log('document closed');
        }


        var options = buildViewerOptions();
        options.title = url.split('/').pop() + '@' + storage;
        var linkHandlers = [
            {
                pattern: '^\/',
                close: false,
                handler: function (link) {
                    alert('link handler called with link: "' + link + '"');
                }
            },
            {
                pattern: '^\/',
                close: false,
                handler: function (link) {
                    alert('This handler should not be called because a prior handler should already have matched.');
                }
            },
            {
                pattern: '^\/order',
                close: false,
                handler: function (link) {
                    alert('This handler should not be called because a prior handler should already have matched.');
                }
            },
            {
                pattern: '[\s\S]*',
                close: true,
                handler: function (link) {
                    // catch-all handler demonstrating document close and regex pattern precedence
                }
            }
        ];

        _sdv.viewDocument(
                url,
                mimeType,
                options,
                onShow,
                onClose,
                function (appId, installer)
                {
                    $('body').removeClass('viewer_open');
                    // missing app
                    if (confirm("Do you want to install the free PDF Viewer App "
                                    + appId + " for Android?"))
                    {
                        installer(
                                function ()
                                {
                                    window.console.log(
                                            'successfully installed app');
                                    if (confirm("App installed. Do you want to view the document now?"))
                                        viewDocument(url, mimeType, storage);
                                },
                                function (error)
                                {
                                    window.console.log('cannot install app');
                                    window.console.log(error);
                                }
                        );
                    }
                },
                function (error)
                {
                    $('body').removeClass('viewer_open');
                    majorError('cannot view document ' + url, error);
                },
                linkHandlers
        );
    }

    return false;
}

function buildFileListing()
{
    var $listing = $('#listing');

    for (var fileLocation in entries)
    {
        if (!entries.hasOwnProperty(fileLocation))
            continue;

        var empty = true;
        var $ul = $('<ul></ul>');

        for (var i = 0; i < files.length; i++)
        {
            var file = files[i];
            var entry = entries[fileLocation][file];
            if (!entry)
                continue;

            empty = false;
            var $li = $('<li></li>');
            $ul.append($li);
            var $a = $('<a>' + file + '</a>');
            $a.attr('href', '#');
            $a.attr('title', entry.url);
            if (entry.canView == null || entry.canView === true)
            {
                $a.click(createDocumentOpener(file, fileLocation));
            }
            else
            {
                $a.click(function ()
                {
                    alert("Cannot open Document in viewer");
                    return false;
                });
                $a.addClass('disabled');
            }
            $li.append($a);
        }
        if (!empty)
        {
            $listing.append('<h2>' + fileLocation + '</h2>');
            $listing.append($ul);
        }
    }
}

function showSupportInfo()
{

    if (!_sdv)
    {
        return;
    }

    var $container = $('#info');

    function appendDeviceInfo()
    {

        var device = window["device"];
        if (!device)
            return;

        showJSONInfo(device, "Device");
        showJSONInfo(cordova.require("cordova/plugin_list").metadata,
                "Plugins");

    }

    function showJSONInfo(json, title)
    {
        var $info = $('<div></div>');
        var $pre = $('<pre></pre>');
        $pre.html(JSON.stringify(json, null, 5));
        $info.append('<h2>' + title + '</h2>');
        $info.append($pre);
        $container.append($info);
    }

    _sdv.getSupportInfo(
            function (supportInfo)
            {
                var $info = $('<div></div>');
                var $pre = $('<pre></pre>');
                $pre.html(JSON.stringify(supportInfo));
                $info.append('<h2>Plugin Support</h2>');
                $info.append($pre);
                $container.append($info);
            },
            function (e)
            {
                majorError("Cannot get support info", e);
            }
    );

    appendDeviceInfo();

}

function init()
{
    if (window.WinJS)
    {
        // see https://msdn.microsoft.com/en-us/library/windows/apps/hh974768.aspx
        // see http://caioproiete.net/en/global-exception-handling-in-windows-store-javascript-applications/
        WinJS.Application.onerror = function (eventInfo)
        {
            window.console.error('WinJS.Application.onerror :', eventInfo);

            var detail = eventInfo.detail;
            var dialog = new Windows.UI.Popups.MessageDialog(
                    detail.stack, detail.message);
            dialog.showAsync().done();

            // By returning true, we signal that the exception was handled,
            // preventing the application from being terminated
            return true;
        }
    }

    function prepareDisplay()
    {
        buildFileListing();
        $('body').addClass('initialized');
    }

    copyFiles(
            prepareDisplay,
            function (e)
            {
                majorError("cannot copy files", e);
                prepareDisplay();
            }
    );

    showSupportInfo();
}

function assertCordova()
{
    if (!window["cordova"])
    {
        majorError("Cordova not loaded");
        return;
    }

    if (!window.cordova["plugins"])
    {
        majorError("Cordova plugins not loaded");
        return;
    }

    if (!window.cordova.plugins["SitewaertsDocumentViewer"])
    {
        majorError("Cordova plugin SitewaertsDocumentViewer not loaded");
        return;
    }

    if (!window.cordova["file"])
    {
        // HACK
        // see https://github.com/apache/cordova-plugin-file
        // see http://stackoverflow.com/questions/26910891/cordova-file-is-undefined-for-windows-wp8
        // see https://msdn.microsoft.com/en-us/library/windows/apps/jj655406.aspx
        if (window.device.platform === 'windows')
        {
            window.console.error(
                    "cordova.file not found because this is a windows machine.");
            window.cordova.file = {
                dataDirectory: 'ms-appdata:///local/',
                cacheDirectory: 'ms-appdata:///temp/',
                documentsDirectory: 'ms-appdata:///local/'
            }
        }
        else
            alert("cordova.file not found. May be you are using the wrong plugin version.");
    }
}

var cordovaPresent = false;

document.addEventListener('deviceready', function ()
{
    assertCordova();

    cordovaPresent = true;

    _sdv = cordova.plugins.SitewaertsDocumentViewer;

    $('body').removeClass('initialized');

    // wait for debugger
    alert("Click OK to init App", start);

    function start()
    {
        $(document).ready(function ()
        {
            init();
        });
    }
});


// setup for desktop browser
setTimeout(function ()
{

    if (cordovaPresent === true)
        return;

    $(document).ready(function ()
    {
        //init();
    });
}, 3000);
