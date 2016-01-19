'use strict';

/**
 * Electron JS File
 *
 */

const _ = require('lodash');
const app = require('app');
const path = require('path');
const BrowserWindow = require('browser-window');
const ipcMain = require('electron').ipcMain;
const filesize = require('filesize');

// ####################################################
// ####################################################

// Report crashes to our server.
require('crash-reporter').start();

var mainWindow = null;
var options = {
    "debug": true,
    "version": "1.0.0",
    "views_dir": "views",
    "root_view": "index.html"
};

var URL_PREFIX = "TEST";

options = _.extend({
    // ADDITIONAL CUSTOM SETTINGS
}, options);

// ############################################################################################
// ############################################################################################

// TODO: Move audio processing to node so the podcast can be listened to with the app 'closed'
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    //if (process.platform !== 'darwin') {
        app.quit();
    //}
});

// Spawn a new window if they re-click on the icon (mac osx)
app.on('activate', function () {
   if (_.isNull(mainWindow)) {
       //createMainWindow();
   }
});

app.on('ready', function () {
    createMainWindow();

    ipcMain.on('test', (event, arg) => {
        event.sender.send('test', filesize(1024));
    });

});

var createMainWindow = function() {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(path.join('file://', __dirname, options.views_dir, options.root_view));
    if (options.debug) {
        mainWindow.openDevTools();
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    URL_PREFIX = path.join('file://', __dirname, options.views_dir);
};

// ############################################################################################
// ############################################################################################
