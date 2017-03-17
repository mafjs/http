var kindOf = require('maf-kind-of');

var validation = require('./validation');

module.exports = function (logger, config, app, endpoint, method) {

    return new Promise((resolve) => {

        var middlewares = [];

        var httpMethod = method.http.method.toLowerCase();
        var httpPath = method.http.path;

        if (endpoint.path) {
            httpPath = endpoint.path + httpPath;
        }

        logger.debug(`add http method`, httpMethod, httpPath);

        if (kindOf(method.schema) === 'object') {
            validation.path(logger, middlewares, method);
            validation.query(logger, middlewares, method);
            validation.cookies(logger, middlewares, method);
            validation.headers(logger, middlewares, method);
            validation.body(logger, middlewares, method);
        }

        app[httpMethod](httpPath, middlewares, method.handler);

        resolve(httpMethod);

    });

};
