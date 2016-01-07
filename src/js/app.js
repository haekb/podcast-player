'use strict';

const DEBUG = true;
const ipcRenderer = require('electron').ipcRenderer;

// TODO: Fix electron bug prevents jquery from being loaded
window.$ = window.jQuery = require('../vendor/jquery/dist/jquery.js');
const _ = require('lodash');
const filesize = require('filesize');

var ngApp = angular.module('ngApp', [
    'ngAnimate',
    'ngRoute',
    'ngMaterial',
    'ngSanitize',
    'xml'
]);


$(function() {
    console.log("Jquery!");
});

/*
 todo:
 https://www.timroes.de/2015/07/29/using-ecmascript-6-es6-with-angularjs-1-x/
 */