var source;
var alpha;
var beta;
var settings;

/**
 * Source Settings
 */
source = {
    dir: {
        base: 'frontend'
    }
};

source = {
    dir: {
        base: source.dir.base,
        app: source.dir.base + '/app',
        less: source.dir.base + '/less',
        image: source.dir.base + '/image',
        font: source.dir.base + '/font'
    }
};

source.file = {
    browserify: {
        entry: './frontend/app/application.ts'
    },
    less: {
        entry:  source.dir.base + '/style.less'
    }
}

source.glob = {
    script: source.dir.app + '/**/*.ts',
    less: [
        source.file.less.entry,
        source.dir.less + '/**/*.*'
    ],
    copy: [
        source.dir.base + '/index.html',
        source.dir.base + '/keycloak.json',
        source.dir.image + '/**/*.*'
    ],
    font: [
        source.dir.base + '/bower_components/**/*.eot', 
        source.dir.base + '/bower_components/**/*.svg', 
        source.dir.base + '/bower_components/**/*.ttf', 
        source.dir.base + '/bower_components/**/*.woff'
    ],
    html: [
        source.dir.base + '/module/**/*.html',
        '!' + source.dir.base + '/bower_components/**'
    ]
};

/**
 * Target
 */
target = {
    dir: {
        base: 'target/frontend'
    }
};

/**
 * Target - Alpha Settings
 */
alpha = {
    dir: {
        base: target.dir.base + '/alpha'
    }
};

alpha = {
    dir: {
        base: alpha.dir.base,
        image: alpha.dir.base + '/image',
        font: alpha.dir.base + '/font'
    }
};

alpha.file = {
    browserify: {
        sourceMap: alpha.dir.base + '/application.js.map',
        output: 'application.js'
    }
};

/**
 * Target - Beta Settings
 */
beta = {
    dir: {
        base: target.dir.base + '/beta'
    }
};

settings = {
    port: 9000
};

module.exports = {
    source: source,
    target: target,
    alpha: alpha,
    beta: beta,
    settings: settings
};

