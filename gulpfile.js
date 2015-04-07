var gulp = require('gulp');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var sourceMaps = require('gulp-sourcemaps');
var gutil = require('gutil');
var notifier = require('node-notifier');
var sourceStream = require('vinyl-source-stream');
var templateCache = require('gulp-angular-templatecache');
var exorcist = require('exorcist');

var es = require('event-stream');
var path = require('path');
var watchify = require('watchify');
var browserify = require('browserify');
var tsify = require('tsify');
var util = require('gulp-util');

var runSequence = require('run-sequence');

var del = require('del');

// HTTP Server
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');
var watching = false;

// Options
var options = require('./options');
var settings = options.settings;
var source = options.source;
var cordova = options.cordova;
var target = options.target;
var alpha = options.alpha;
var beta = options.beta;

// process.env.BROWSERIFYSHIM_DIAGNOSTICS=1

// Standard handler
function standardHandler(err) {
    // Notification
    notifier.notify({ message: 'Error: ' + err.message });
    // Log to console
    util.log(util.colors.red('Error'), err.message);
    this.emit('end');
}

function bundle() {

    var bundler = browserify({ debug: true })
        .add('./src/script/main.ts')
        .plugin('tsify', { 
            //noImplicitAny: true 
        });
        //.plugin('minifyify', { map: 'bundle.map.json', output: alpha.baseDir + "/bundle.map.json" });

    bundler.on('update', bundle); // on any dep update, runs the bundler
    bundler.on('log', gutil.log); // output build logs to terminal

    return bundler.bundle()
        // log errors if they happen
        .on('error', standardHandler)
        .pipe(exorcist(alpha.baseDir + '/application.js.map'))
        .pipe(sourceStream('application.js'))
        .pipe(gulp.dest(alpha.baseDir))
        .pipe(gulpif(watching, connect.reload()));

}

gulp.task('default', function (cb) {

    watching = true;
    return runSequence(['clean'], ['augment'], ['connect', 'watch'], cb);

}); // ['clean'], ['augment', 'watch', 'connect']);

gulp.task('clean', function (cb) {
    return del(target.baseDir, cb);
});

gulp.task('watch', function () {

    watching = true;
    
    gulp.watch(source.lessDir + "/**/*.*", ['augment-less']);
    gulp.watch(source.scriptDir + "/**/*.*", ['augment-script']);
    gulp.watch(source.baseDir + "/index.html", ['augment-html-index']);
    gulp.watch(source.baseDir + "/view/**/*.html", ['augment-script']);

    return gulp.watch([
        source.baseDir + "/bower_components/**/*.eot", 
        source.baseDir + "/bower_components/**/*.svg", 
        source.baseDir + "/bower_components/**/*.ttf", 
        source.baseDir + "/bower_components/**/*.woff"
    ], ['augment-font']);

});

gulp.task('augment', ['augment-html-index', 'augment-html', 'augment-font', 'augment-script', 'augment-less']);

gulp.task('augment-script', ['augment-html'], bundle);

gulp.task('augment-html-index', function () {
    return gulp.src([source.baseDir + "/index.html"])
        .pipe(gulp.dest(alpha.baseDir))
        .pipe(gulpif(watching, connect.reload()));
});

gulp.task('augment-html', function () {
    return gulp.src([ source.baseDir + "/**/*.html", '!' + source.baseDir + '/bower_components/**' ])
        .pipe(templateCache({
            filename: 'templates.js',
            templateHeader: 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {',
            standalone: true
        }))
        .pipe(gulp.dest(source.scriptDir))
        .pipe(gulpif(watching, connect.reload()));
});

gulp.task('augment-font', function () {
    return gulp.src([
        source.baseDir + "/bower_components/**/*.eot", 
        source.baseDir + "/bower_components/**/*.svg", 
        source.baseDir + "/bower_components/**/*.ttf", 
        source.baseDir + "/bower_components/**/*.woff", 
        source.baseDir + "/bower_components/**/*.woff2"])
    .pipe(es.map(function(file, callback) {
        file.path = file.base + file.path.replace(/^.*\//i, "");
        return callback(null, file);
    }))
    .pipe(gulp.dest(alpha.fontDir))
    .pipe(gulpif(watching, connect.reload()));
});

gulp.task('augment-less', function() {
    return gulp.src(source.lessDir + "/style.less").pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest(alpha.cssDir))
    .pipe(gulpif(watching, connect.reload()));
});


gulp.task('connect', function () {
    return connect.server({
        root: [alpha.baseDir],
        port: settings.port,
        livereload: true,
        middleware: function (connect, o) {
            return [
                (function () {
                    var proxy, url;
                    url = require("url");
                    proxy = require("proxy-middleware");
                    options = url.parse("http://localhost:8080/service/api");
                    options.route = "/api";
                    return proxy(options);
                })(), 
                (function () {
                    var proxy, url;
                    url = require("url");
                    proxy = require("proxy-middleware");
                    options = url.parse("http://localhost:8080/service/images");
                    options.route = "/images";
                    return proxy(options);
                })(), 
                historyApiFallback
            ];
        }
    });
});


