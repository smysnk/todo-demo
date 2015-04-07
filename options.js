var settings = {
    port: 9000
};

var source = {};

source.baseDir = 'src/frontend';
source.scriptDir = source.baseDir + "/script";
source.lessDir = source.baseDir + "/less";
source.imageDir = source.baseDir + "/image";
source.jsDir = source.baseDir + "/_js";

var target = {};
target.baseDir = 'target';

var alpha = {};
alpha.baseDir = target.baseDir + "/alpha";
alpha.cssDir = alpha.baseDir + "/css";
alpha.jsDir = alpha.baseDir + "/js";
alpha.imageDir = alpha.baseDir + "/image";
alpha.fontDir = alpha.baseDir + "/font";

var beta = {};
beta.baseDir = target.baseDir + "/beta";

module.exports = {
    source: source,
    target: target,
    alpha: alpha,
    beta: beta,
    settings: settings
};

