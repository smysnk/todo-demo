gulp = require 'gulp'
require('gulp-grunt')(gulp)

gulpif = require 'gulp-if'
less = require 'gulp-less'
del = require 'del'
concat = require 'gulp-concat'
coffee = require 'gulp-coffee'
livereload = require 'gulp-livereload'
connect = require 'gulp-connect'
historyApiFallback = require 'connect-history-api-fallback'
gzip = require 'gulp-gzip'
open = require 'open'
path = require 'path'
es = require 'event-stream'
map = require 'map-stream'
runSequence = require 'run-sequence'
usemin = require 'gulp-usemin'
streamqueue = require 'streamqueue'
Q = require 'q'
awspublish = require 'gulp-awspublish'
wrapamd = require 'gulp-wrap-amd'
babel = require 'gulp-babel'
templateCache = require 'gulp-angular-templatecache'
 
# Have to share options between gruntfile + gulpfile due to requirejs issues
options = require './options'
settings = options.settings
source = options.source
cordova = options.cordova

target = options.target
alpha = options.alpha
beta = options.beta

watching = false

s3 = require("gulp-s3")
revall = require('gulp-rev-all')

###
Tasks
###


gulp.task 'clean', (cb) ->
    return del(target.baseDir, cb)
    

gulp.task 'default', ->

    runSequence(
        ['create-applicationjs-development', 'augment-script', 'augment-js', 'augment-html', 'augment-html-views', 'augment-font', 'augment-less'] # Make sure augments are fresh
        ['connect', 'watch']
    )


# Chores


gulp.task 'chore-webapp-upgrade', ->
    # When views change on web_application project they need to be copied into root folder of this project.
    # TODO: Find a better way to integrate web_application views into this project
    return gulp.src("#{source.baseDir}/lib/web_application/src/view/**")
        .pipe(gulp.dest("#{source.baseDir}/view"))


# Augmenters, middleware used to assist in development stage (i.e. SASS -> CSS conversion)

gulp.task 'create-applicationjs-development', ->
    return gulp.src([
            "#{source.baseDir}/bower_components/requirejs/require.js"
        ])
        .pipe(concat("application.js"))
        .pipe(gulp.dest(source.baseDir))

gulp.task 'augment', ['augment-html', 'augment-html-views', 'augment-font', 'augment-script', 'augment-js', 'augment-less']

gulp.task 'augment-html', ->
    return gulp.src(["#{source.baseDir}/index.html"])
        .pipe(gulpif(watching, connect.reload()))

gulp.task 'augment-html-views', ->
    return gulp.src(["#{source.baseDir}/**/*.html", "!#{source.baseDir}/bower_components/**", "!#{source.baseDir}/index.html"])
        .pipe(templateCache({
            moduleSystem: 'RequireJS'
            standalone: true
        }))
        .pipe(gulp.dest(source.jsDir))
        .pipe(gulpif(watching, connect.reload()))

gulp.task 'augment-font', ->
    return gulp.src([
            "#{source.baseDir}/bower_components/**/*.eot",
            "#{source.baseDir}/bower_components/**/*.svg",
            "#{source.baseDir}/bower_components/**/*.ttf",
            "#{source.baseDir}/bower_components/**/*.woff",
            "#{source.baseDir}/bower_components/**/*.woff2"
        ])
        .pipe(es.map((file, callback) ->
            # Hack to remove base path so we're left with just the file, no sub-directories
            file.path = file.base + file.path.replace(/^.*\//i,"")
            callback(null, file)
        ))
        .pipe(gulp.dest(source.fontDir))
        .pipe(gulpif(watching, connect.reload()))

gulp.task 'augment-js', ->
    return gulp.src([
            "#{source.baseDir}/bower_components/angular-ui-router/release/angular-ui-router.js",        
            "#{source.baseDir}/bower_components/restangular/dist/restangular.js"
        ])
        .pipe(wrapamd({
            deps: ['jquery', 'angular', 'lodash'],     
            params: ['jQuery', 'angular', 'lodash'],
            exports: ';'
        }))
        .pipe(gulp.dest(source.jsDir))
        .pipe(gulpif(watching, connect.reload()))


gulp.task 'augment-script', ->
    return gulp.src(["#{source.scriptDir}/**/*.js"])
        .pipe(babel())
        .pipe(gulp.dest(source.jsDir))
        .pipe(gulpif(watching, connect.reload()))


gulp.task 'augment-less', ->

    return gulp.src("#{source.lessDir}/style.less")
        .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest(source.cssDir))
        .pipe(gulpif(watching, connect.reload()))


gulp.task 'watch', ->
    watching = true
    gulp.watch("#{source.lessDir}/**/*.*", ['augment-less'])
    gulp.watch("#{source.scriptDir}/**/*.*", ['augment-script'])
    gulp.watch(["#{source.baseDir}/*.html", "#{source.baseDir}/view/**/*.html", "#{source.baseDir}/partials/**/*.html"], ['augment-html'])
    gulp.watch([
        "#{source.baseDir}/bower_components/**/*.eot"
        "#{source.baseDir}/bower_components/**/*.svg"
        "#{source.baseDir}/bower_components/**/*.ttf"
        "#{source.baseDir}/bower_components/**/*.woff"
    ], ['augment-font'])


gulp.task 'connect', ->
    connect.server({
        root: [source.baseDir]
        port: settings.port
        livereload: true
        middleware: (connect, o) ->
            [
                (->
                    url = require("url")
                    proxy = require("proxy-middleware")
                    
                    options = url.parse("http://localhost:8080/service/api")
                    options.route = "/api"

                    proxy(options)
                )(),
                (->
                    url = require("url")
                    proxy = require("proxy-middleware")
                    
                    options = url.parse("http://localhost:8080/service/images")
                    options.route = "/images"

                    proxy(options)
                )(),
                historyApiFallback
            ]
    })


# Release

gulp.task 'release', ->
    runSequence(
        'clean', # Empty out target directory
        'augment',
        'grunt-requirejs-release', # Make sure augments are fresh + Prepare application.js
        'release-copy', # Copy essentials over
        'release-revision'
    )


gulp.task 'release-copy', ->

    templateCacheOptions = {
        root: '/script'
    }
    return es.concat(
        gulp.src("#{source.baseDir}/*.ico").pipe(gulp.dest(alpha.baseDir))
        gulp.src("#{source.baseDir}/*.json").pipe(gulp.dest(alpha.baseDir))
        gulp.src("#{source.imageDir}/**/*.*").pipe(gulp.dest(alpha.imageDir))
        gulp.src("#{source.fontDir}/**").pipe(gulp.dest(alpha.fontDir))
        gulp.src("#{source.baseDir}/index.html").pipe(usemin()).pipe(gulp.dest(alpha.baseDir))
        gulp.src("#{source.baseDir}/css/style.css").pipe(gulp.dest("#{alpha.baseDir}/css"))        
    )


gulp.task "release-revision", ->
    gulp
        .src("#{alpha.baseDir}/**")
        .pipe(revall({ ignore: [/^\/favicon.ico$/, /^\/[^\.]*\.js\.map$/, /^\/image\/asset/, /^\/index.html/ ] }))
        .pipe(gulp.dest(beta.baseDir))
         


gulp.task 'release-connect', ->
    
    connect.server({
        root: [alpha.baseDir]
        port: settings.port
        livereload: true
        middleware: (connect, o) ->
            [
                (->
                    url = require("url")
                    proxy = require("proxy-middleware")
                    
                    options = url.parse("http://localhost:8080/service/api")
                    options.route = "/api"

                    proxy(options)
                )(),
                (->
                    url = require("url")
                    proxy = require("proxy-middleware")
                    
                    options = url.parse("http://localhost:8080/service/images")
                    options.route = "/images"

                    proxy(options)
                )()
            ]
    })



