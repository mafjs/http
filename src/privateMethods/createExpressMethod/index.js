const kindOf = require('maf-kind-of');

const initStartTime = require('./initStartTime');
const initResponseTimeout = require('./initResponseTimeout');
const initReq = require('./initReq');
const initReqDi = require('./initReqDi');
const initRes = require('./initRes');
const initResCtx = require('./initResCtx');

const initPathValidation = require('./initPathValidation');
const initQueryValidation = require('./initQueryValidation');
const initCookiesValidation = require('./initCookiesValidation');
const initHeadersValidation = require('./initHeadersValidation');
const initBodyValidation = require('./initBodyValidation');

const initHandler = require('./initHandler');


// var validation = require('./validation');
//
// var init = require('./init');

module.exports = function createExpressMethod(
    logger,
    config,
    requestHelpers,
    responseHelpers,
    app,
    di,
    endpoint,
    rawMethod
) {
    return new Promise((resolve, reject) => {
        // prepare method object
        const method = {
            httpMethod: rawMethod.http.method.toLowerCase(),
            route: rawMethod.http.path,
            middlewares: []
        };

        if (endpoint.path) {
            method.route = endpoint.path + method.route;
        }

        logger.debug(
            {
                record: {
                    httpMethod: method.httpMethod,
                    route: method.route
                }
            },
            'create express method'
        );

        if (kindOf(rawMethod.schema) === 'object') {
            method.schema = rawMethod.schema;
        } else {
            method.schema = {};
        }

        if (rawMethod.beforeMethodCreation) {
            rawMethod.beforeMethodCreation(method, di);
        }

        method.middlewares.push(initStartTime(logger));
        method.middlewares.push(initResponseTimeout(logger, rawMethod.timeout));
        method.middlewares.push(initReq(logger, requestHelpers));
        method.middlewares.push(initReqDi(logger, di));
        method.middlewares.push(initRes(logger, responseHelpers));
        method.middlewares.push(initResCtx(logger));

        if (kindOf(method.schema) === 'object') {
            initPathValidation(logger, method.middlewares, method.schema.path);
            initQueryValidation(logger, method.middlewares, method.schema.query);
            initCookiesValidation(logger, method.middlewares, method.schema.cookies);
            initHeadersValidation(logger, method.middlewares, method.schema.headers);
            initBodyValidation(logger, method.middlewares, method.schema.body);
        }

        if (typeof rawMethod.middlewares !== 'undefined') {
            if (!Array.isArray(rawMethod.middlewares)) {
                const error = new Error(`${method.httpMethod} ${method.route} method.middlewares should be an array`);
                return reject(error);
            }

            logger.debug(`${method.httpMethod} ${method.route} add ${rawMethod.middlewares.length} middlewares`);

            Object.keys(rawMethod.middlewares).forEach((i) => {
                if (typeof middleware !== 'function') {
                    return reject(new Error(`${method.httpMethod} ${method.route} method.middlewares[${i}] should be a function`));
                }

                return method.middlewares.push(rawMethod.middlewares[i]);
            });
        }

        const handler = initHandler(logger, method.httpMethod, method.route, rawMethod.handler);
        method.middlewares.push(handler);

        return resolve(method);
    });
};
