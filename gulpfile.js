var gulp = require('gulp');
var gulpIf = require('gulp-if');
var gutil = require('gutil');
var notifier = require('node-notifier');

var sourceMaps = require('gulp-sourcemaps');
var sourceStream = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

var templateCache = require('gulp-angular-templatecache');

var es = require('event-stream');
var path = require('path');
var browserify = require('browserify');
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
var target = options.target;
var alpha = options.alpha;
var beta = options.beta;

// process.env.BROWSERIFYSHIM_DIAGNOSTICS=1

// Standard handler
function standardHandler(err) {
    // Notification
    notifier.notify({ message: 'Error: ' + err.message });
    // Log to console
    gutil.log(util.colors.red('Error'), err.message);
    this.emit('end');
}

function bundle() {

    var bundler = browserify({ debug: true })
        .add(source.file.browserify.entry)
        .plugin('tsify', { 
            //noImplicitAny: true 
        })
        .on('update', bundle) // on any dep update, runs the bundler
        .on('log', gutil.log); // output build logs to terminal
    
    return bundler
        .bundle()
            .on('error', standardHandler)
        .pipe(sourceStream(alpha.file.browserify.output))
        .pipe(buffer())
        .pipe(sourceMaps.init({ loadMaps: true }))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
            .on('error', standardHandler)
        .pipe(sourceMaps.write('./map'))
        .pipe(gulp.dest(alpha.dir.base))
        .pipe(gulpIf(watching, connect.reload()));

}

gulp.task('default', function (cb) {

    watching = true;
    return runSequence(['clean'], ['augment'], ['connect', 'watch'], cb);

});

gulp.task('clean', function (cb) {
    
    return del(target.dir.base, cb);

});

gulp.task('watch', function () {

    watching = true;
    
    gulp.watch(source.glob.copy, ['copy']);
    gulp.watch(source.glob.font, ['augment-font']);
    gulp.watch(source.glob.less, ['augment-less']);
    gulp.watch(source.glob.script, ['augment-script']);
    return gulp.watch(source.glob.html, ['augment-script']); // Call script because 'augment-html' is a dependency
    
});

gulp.task('augment', ['copy', 'augment-html', 'augment-font', 'augment-script', 'augment-less']);

gulp.task('copy', function () {

    return gulp
        .src(source.glob.copy, { base: source.dir.base })
        .pipe(gulp.dest(alpha.dir.base))
        .pipe(gulpIf(watching, connect.reload()));

});

gulp.task('augment-html', function () {

    return gulp
        .src(source.glob.html)
        .pipe(templateCache({
            filename: 'templates.js',
            templateHeader: 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {',
            standalone: true
        }))
        .pipe(gulp.dest(source.dir.app));

});

gulp.task('augment-font', function () {

    return gulp
        .src(source.glob.font)
        .pipe(es.map(function(file, callback) { // Rebase files from random bower directories
            file.path = file.base + file.path.replace(/^.*\//i, ''); 
            return callback(null, file);
        }))
        .pipe(gulp.dest(alpha.dir.font))
        .pipe(gulpIf(watching, connect.reload()));

});


gulp.task('augment-script', ['augment-html'], bundle);

gulp.task('augment-less', function() {

    return gulp
        .src(source.file.less.entry)
        .pipe(sourceMaps.init())
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')],
        }))
            .on('error', standardHandler)
        .pipe(minifyCSS())
        .pipe(sourceMaps.write('./map'))
        .pipe(gulp.dest(alpha.dir.base))
        .pipe(gulpIf(watching, connect.reload()));

});


gulp.task('connect', function () {

    return connect.server({
        root: [alpha.dir.base],
        port: settings.port,
        livereload: true,
        middleware: function (connect, o) {
            return [
                (function () {
                    var proxy, url;
                    url = require('url');
                    proxy = require('proxy-middleware');
                    options = url.parse('http://localhost:8080/service/api');
                    options.route = '/api';
                    return proxy(options);
                })(), 
                (function () {
                    var proxy, url;
                    url = require('url');
                    proxy = require('proxy-middleware');
                    options = url.parse('http://localhost:8080/service/images');
                    options.route = '/images';
                    return proxy(options);
                })(), 
                historyApiFallback
            ];
        }
    });

});

