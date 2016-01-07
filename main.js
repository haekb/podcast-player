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

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL(path.join('file://', __dirname, options.views_dir, options.root_view));
    if (options.debug) {
        mainWindow.openDevTools();
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    URL_PREFIX = path.join('file://', __dirname, options.views_dir);

    ipcMain.on('test', (event, arg) => {
       event.sender.send('test',filesize(1024));
    });

});

// ############################################################################################
// ############################################################################################
