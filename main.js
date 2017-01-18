'use strict';

/**
 * Electron JS File
 *
 */

const _ = require('lodash');
const filesize = require('filesize');
const path = require('path');

// Electron requires
const electron = require('electron');
const app = electron.app;
const browserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const menu = electron.Menu;
const globalShortcut = electron.globalShortcut;
//const webContents = electron.webContents;

// ####################################################
// ####################################################

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
  createMenus();
  createHotKeys();


  ipcMain.on('test', (event, arg) => {
    event.sender.send('test', filesize(1024));
  });

});

let createMainWindow = function () {
  mainWindow = new browserWindow({width: 800, height: 600, title: "Podcast Duder"});
  mainWindow.loadURL(path.join('file://', __dirname, options.views_dir, options.root_view));
  if (options.debug) {
    //mainWindow.openDevTools();
  }
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  URL_PREFIX = path.join('file://', __dirname, options.views_dir);
};

let createMenus = function () {

  let template = [{
    label: "Application",
    submenu: [
      {label: "About Application", selector: "orderFrontStandardAboutPanel:"},
      {type: "separator"},
      {
        label: "Quit", accelerator: "Command+Q", click: function () {
        app.quit();
      }
      }
    ]
  }, {
    label: "Edit",
    submenu: [
      {label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
      {label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
      {type: "separator"},
      {label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
      {label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
      {label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
      {label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
    ]
  },
    {
      label: "Debug",
      submenu: [
        {
          label: "Open Dev Tools", click: function () {
          mainWindow.openDevTools();
        }
        }
      ]
    }
  ];

  menu.setApplicationMenu(menu.buildFromTemplate(template));
};

let createHotKeys = function () {
  let registerPausePlay = globalShortcut.register('mediaplaypause', () => {
    mainWindow.webContents.send('hotkeyEvent', 'mediaplaypause');
    console.log('Media Play/Pause encountered');
  });

  let registerNext = globalShortcut.register('medianexttrack', () => {
    mainWindow.webContents.send('hotkeyEvent', 'medianexttrack');

    console.log("Media Next Track encountered");
  });

  let registerPrevious = globalShortcut.register('mediaprevioustrack', () => {
    mainWindow.webContents.send('hotkeyEvent', 'mediaprevioustrack');

    console.log("Media Previous Track encountered");
  });

  let registerStop = globalShortcut.register('mediastop', () => {
    mainWindow.webContents.send('hotkeyEvent', 'mediastop');

    console.log("Media Previous Track encountered");
  });

};

// ############################################################################################
// ############################################################################################
