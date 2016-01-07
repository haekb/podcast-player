'use strict';

import del from 'del';
import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpLoadPlugins from 'gulp-load-plugins';
var concat = require('gulp-concat')
var filter = require('gulp-filter')
//var vendor = require('gulp-concat-vendor');


let wiredep = require('wiredep').stream;

const plugins = gulpLoadPlugins();
const sassRoot = 'src/scss';
const cssRoot = 'dist/css';
const jsBldRoot = 'dist/js';
const jsSrcRoot = 'src/js';


const views = 'views/**/*.html';
const viewsRoot = 'views/';

const vendor_scripts = [
    'vendor/jquery/dist/jquery.js',
    'vendor/x2js/xml2json.js',
    'vendor/angular/angular.js',
    'vendor/angular-animate/angular-animate.js',
    'vendor/angular-aria/angular-aria.js',
    'vendor/angular-material/angular-material.js',
    'vendor/angular-route/angular-route.js',
    'vendor/angular-sanitize/angular-sanitize.js',
    'vendor/angular-xml/angular-xml.js'

];

const vendor_styles = [
    'vendor/angular/angular-csp.css',
    'vendor/angular-material/angular-material.css',
    'vendor/angular-material/angular-material.layouts.css'
];


function handleError(err) {
    console.log(err.toString());
}

// ############################################################################################
// ############################################################################################

gulp.task('clean:styles', (cb) => {
    del([
        '**/.sass-cache/**',
        ], cb);
})
;

gulp.task('inject-dependencies', function () {
    return gulp.src(views)
        .pipe(wiredep())
        .pipe(plugins.rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(viewsRoot));
});

gulp.task('build-sass', () => {
    return gulp.src(sassRoot + '/*.scss')
        .pipe(plugins.plumber())
        .pipe(plugins.notify('Compile Sass File: <%= file.relative %>...'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.autoprefixer('last 10 versions'))
        .pipe(plugins.sass({
            style: 'compressed'
        })).on('error', handleError)
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(cssRoot));
})
;

gulp.task('build-js', function () {
    gulp.src(['src/**/app.js', 'src/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(jsBldRoot))
});

gulp.task('build-vendor', function () {

    gulp.src(vendor_scripts)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(jsBldRoot));

    gulp.src(vendor_styles)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(cssRoot));

    /*
     gulp.src('./vendor/*')
     .pipe(vendor('vendor.js'))
     .pipe(gulp.dest(jsBldRoot));


     gulp.src('./vendor/*')
     .pipe(vendor('vendor.css'))
     .pipe(gulp.dest(cssRoot));
     */
    /*
     return gulp.src('./vendor')
     .pipe(wiredep())
     .pipe(gulp.dest('dist'));
     */
});


// ############################################################################################
// ############################################################################################

gulp.task('watch-sass', () => {
    plugins.notify('Sass Stream is Active...');
gulp.watch(sassRoot + '/**/*.scss', ['build-sass']);
})
;

gulp.task('watch-js', () => {
    plugins.notify('JS Stream is Active...');
gulp.watch(jsSrcRoot + '/**/*.js', ['build-js']);
})
;


// ############################################################################################
// ############################################################################################

gulp.task('default', ['build-sass', 'build-js', 'build-vendor', /*'inject-dependencies'*/], () => {
    gutil.log('Transposing Sass...');
})
;

gulp.task('clean', ['clean:styles']);
gulp.task('watch', ['watch-sass', 'watch-js']);

