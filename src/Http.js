const kindOf = require('maf-kind-of');
const HttpError = require('./Error');

const validateConfig = require('./privateMethods/validateConfig');
const validateHttpParam = require('./privateMethods/validateHttpParam');
const validateMethod = require('./privateMethods/validateMethod');
const createExpressMethod = require('./privateMethods/createExpressMethod');

const helpers = require('./helpers');
const middlewares = require('./middlewares');

class Http {
    /**
     * @param {logger} logger
     * @param {Object} config
     */
    constructor(logger, config) {
        this.Error = HttpError;

        this.requestHelpers = helpers.request;
        this.responseHelpers = helpers.response;

        this._logger = logger;

        this._config = validateConfig(config);

        this._endpoint = {
            title: null,
            description: null,
            path: null
        };

        this._methodInc = 0;

        this._methods = {};

        this._beforeResponseMiddleware = null;
    }

    /**
     * set endpoint
     *
     * @param {String|Object} endpoint
     */
    setEndpoint(endpoint) {
        this._logger.debug({ record: endpoint }, 'setEndpoint');

        // TODO validate endpoint
        if (kindOf(endpoint) === 'string') {
            this._endpoint.path = endpoint;
        } else if (kindOf(endpoint) === 'object') {
            this._endpoint = endpoint;
        }
    }

    setBeforeResponseMiddleware(fn) {
        this._logger.debug('setBeforeResponseMiddleware');
        // TODO validate and error
        this._beforeResponseMiddleware = fn;
        return this;
    }

    /**
     * add rest method
     *
     * @param {String|Object} rawHttp
     * @param {Object} rawMethod
     * @return {Promise}
     */
    addMethod(rawHttp, rawMethod) {
        this._logger.debug({ record: rawHttp }, 'addMethod');

        let http = null;
        let method = null;

        this._methodInc += 1;
        const methodId = this._methodInc;

        return Promise.resolve()
            .then(() => validateHttpParam(this._logger, this._config, rawHttp))
            .then((validHttp) => {
                http = validHttp;

                return validateMethod(this._logger, this._config, http, rawMethod);
            })
            .then((validMethod) => {
                method = validMethod;

                method.http = http;

                this._methods[methodId] = method;

                return true;
            });
    }

    /**
     * add rest methods
     *
     * @param {Object} methods
     * @return {Promise}
     */
    addMethods(methods) {
        return new Promise((resolve, reject) => {
            this._logger.debug({ record: Object.keys(methods) }, 'addMethods');

            const methodsParamType = kindOf(methods);

            if (methodsParamType !== 'object') {
                return reject(this.Error.createError(this.Error.CODES.INVALID_ARGS).bind({
                    method: 'addMethods',
                    param: 'methods',
                    validType: 'object',
                    type: methodsParamType,
                    value: this._json(methods)
                }));
            }

            const promises = [];

            Object.keys(methods).forEach((http) => {
                this._logger.trace({ record: http }, 'addMethods => addMethod');
                promises.push(this.addMethod(http, methods[http]));
            });

            return Promise.all(promises)
                .then(() => {
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * @param {Express} app express app
     * @param {Object} di
     * @return {Promise}
     */
    init(app, di) {
        return new Promise((resolve, reject) => {
            this._logger.debug('init');

            app.use(middlewares.requestId(this._logger));

            // TODO
            if (this._config.responseTimeout) {
                // eslint-disable-next-line no-param-reassign
                app.locals.responseTimeout = this._config.responseTimeout;
            }

            const promises = [];

            Object.keys(this._methods).forEach((id) => {
                const methodPromise = createExpressMethod(
                    this._logger,
                    this._config,
                    this.requestHelpers,
                    this.responseHelpers,
                    app,
                    di,
                    this._endpoint,
                    this._methods[id]
                );

                promises.push(methodPromise);
            });

            Promise.all(promises)
                .then((methods) => {
                    Object.keys(methods).forEach((i) => {
                        const method = methods[i];

                        if (this._beforeResponseMiddleware) {
                            method.middlewares.push(this._beforeResponseMiddleware);
                        }

                        this._logger.trace(`add express method for ${method.httpMethod.toUpperCase()} ${method.route}`);

                        app[method.httpMethod](method.route, method.middlewares);
                    });

                    resolve(app);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }


    createBasicMiddlewareNotFound() {
        this._logger.trace('create basicMiddlewareNotFound');
        return middlewares.basicNotFound;
    }

    createBasicMiddlewareSend() {
        this._logger.trace('create basicMiddlewareSend');
        return middlewares.basicSend;
    }

    createBasicMiddlewareError() {
        this._logger.trace('create basicMiddlewareError');
        return middlewares.basicError;
    }
}

module.exports = Http;
