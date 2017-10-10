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

/**
 * @param {Logger} logger
 * @param {Object} rawMethod
 * @param {Object} method
 * @param {String} name
 */
function addCustomMiddlewares(logger, rawMethod, method, name) {
    const customMiddlewares = rawMethod[name];

    if (typeof customMiddlewares !== 'undefined') {
        if (!Array.isArray(customMiddlewares)) {
            throw new Error(
                `${method.httpMethod} ${method.route} method.${name} should be an array`
            );
        }

        logger.debug(
            `${method.httpMethod} ${method.route} add ${customMiddlewares.length} ${name}`
        );

        Object.keys(customMiddlewares).forEach((i) => {
            const middleware = customMiddlewares[i];
            if (typeof middleware !== 'function') {
                throw new Error(
                    // eslint-disable-next-line max-len
                    `${method.httpMethod} ${method.route} method.${name}[${i}] should be a function, got ${typeof middleware}`
                );
            }

            return method.middlewares.push(rawMethod[name][i]);
        });
    }
}


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
            middlewares: [],
        };

        if (endpoint.path) {
            method.route = endpoint.path + method.route;
        }

        logger.debug(
            {
                record: {
                    httpMethod: method.httpMethod,
                    route: method.route,
                },
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

        try {
            addCustomMiddlewares(logger, rawMethod, method, 'beforeInitMiddlewares');
        } catch (error) {
            return reject(error);
        }

        method.middlewares.push(initStartTime(logger));
        method.middlewares.push(initResponseTimeout(logger, rawMethod.timeout));
        method.middlewares.push(initReq(logger, requestHelpers));
        method.middlewares.push(initReqDi(logger, di));
        method.middlewares.push(initRes(logger, responseHelpers));
        method.middlewares.push(initResCtx(logger));

        try {
            addCustomMiddlewares(logger, rawMethod, method, 'beforeValidationMiddlewares');
        } catch (error) {
            return reject(error);
        }

        if (kindOf(method.schema) === 'object') {
            initPathValidation(logger, method.middlewares, method.schema.path);
            initQueryValidation(logger, method.middlewares, method.schema.query);
            initCookiesValidation(logger, method.middlewares, method.schema.cookies);
            initHeadersValidation(logger, method.middlewares, method.schema.headers);
            initBodyValidation(logger, method.middlewares, method.schema.body);
        }

        try {
            addCustomMiddlewares(logger, rawMethod, method, 'middlewares');
        } catch (error) {
            return reject(error);
        }

        const handler = initHandler(logger, method.httpMethod, method.route, rawMethod.handler);

        method.middlewares.push(handler);

        return resolve(method);
    });
};
