
# Have to share options between gruntfile + gulpfile due to requirejs issues
options = require './options'
settings = options.settings
source = options.source
target = options.target
alpha = options.alpha
beta = options.beta

module.exports = (grunt) ->

    # Load all grunt tasks
    require('load-grunt-tasks')(grunt)
    
    grunt.initConfig
        requirejs:       
            release: 
                options:
                    mainConfigFile: "#{source.jsDir}/main.js"
                    baseUrl: source.jsDir
                    useStrict: true
                    wrap: true
                    include: ['../bower_components/requirejs/require.js', 'main']
                    exclude: []
                    out: "#{alpha.baseDir}/application.js"
                    paths: { }
                    optimize: 'uglify2'
                    generateSourceMaps: true
                    preserveLicenseComments: false
                    uglify2: 
                        output: 
                            beautify: false
                        compress: 
                            sequences: false,
                            global_defs: 
                                DEBUG: false
                        warnings: true
                        mangle: false

    
    grunt.registerTask 'requirejs-release', ['requirejs:release']
