var kindOf = require('maf-kind-of');

var validation = require('./validation');

var init = require('./init');

// eslint-disable-next-line max-params, max-statements
module.exports = function (logger, config, requestHelpers, responseHelpers, app, di, endpoint, method) {

    // eslint-disable-next-line max-params, max-statements
    return new Promise((resolve, reject) => {

        var middlewares = [];

        var httpMethod = method.http.method.toLowerCase();
        var httpPath = method.http.path;

        if (endpoint.path) {
            httpPath = endpoint.path + httpPath;
        }

        logger.debug(`add http method`, httpMethod, httpPath);

        if (kindOf(method.schema) === 'undefined') {
            method.schema = {};
        }

        if (method.beforeMethodCreation) {
            method.beforeMethodCreation(method, di);
        }

        init.httpContext(logger, middlewares);
        init.response(logger, middlewares, requestHelpers, responseHelpers);

        if (kindOf(method.schema) === 'object') {
            validation.path(logger, middlewares, method);
            validation.query(logger, middlewares, method);
            validation.cookies(logger, middlewares, method);
            validation.headers(logger, middlewares, method);
            validation.body(logger, middlewares, method);
        }

        if (typeof method.middlewares !== 'undefined') {

            if (!Array.isArray(method.middlewares)) {
                return reject(
                    new Error(
                        `${method.httpMethod} ${method.path} method.middlewares should be an array`
                    )
                );
            }

            logger.debug(`${method.httpMethod} ${method.path} add ${method.middlewares.length} middlewares`);

            for (var i in method.middlewares) {
                let middleware = method.middlewares[i];

                if (typeof middleware !== 'function') {
                    return reject(
                        new Error(
                            `${method.httpMethod} ${method.path} method.middlewares[${i}] should be a function`
                        )
                    );
                }

                middlewares.push(middleware);
            }

        }

        var expressMethod = init.handler(logger, app, httpMethod, httpPath, middlewares, method);

        resolve(expressMethod);

    });

};
