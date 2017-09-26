var kindOf = require('maf-kind-of');
var HttpError = require('./Error');

var requestHelpers = require('./requestHelpers');
var responseHelpers = require('./responseHelpers');

var validateHttpParam = require('./methods/validateHttpParam');
var validateMethod = require('./methods/validateMethod');
var addExpressMethod = require('./methods/addExpressMethod');

var expressMiddlewares = require('./expressMiddlewares');

/**
 *
 */
class Http {

    /**
     * @param {?Logger} logger
     * @param {?Object} config
     */
    constructor (logger, config) {
        /**
         * @type {HttpError}
         */
        this.Error = HttpError;

        this.requestHelpers = requestHelpers;
        this.responseHelpers = responseHelpers;

        this._logger = this._validateLogger(logger);
        this._prepareLogger = this._logger.getLogger('prepare');
        this._config = this._validateConfig(config);

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
    setEndpoint (endpoint) {
        this._prepareLogger.debug({record: endpoint}, 'setEndpoint');

        // TODO validate endpoint
        if (kindOf(endpoint) === 'string') {
            this._endpoint.path = endpoint;
        } else if (kindOf(endpoint) === 'object') {
            this._endpoint = endpoint;
        }
    }

    /**
     * add rest method
     *
     * @param {String|Object} rawHttp
     * @param {Object} rawMethod
     * @return {Promise}
     */
    addMethod (rawHttp, rawMethod) {

        this._prepareLogger.debug({record: rawHttp}, 'addMethod');

        var http = null;
        var method = null;

        var methodId = this._methodInc++;

        return Promise.resolve()
            .then(() => {
                return validateHttpParam(this._prepareLogger, this._config, rawHttp);
            })
            .then((validHttp) => {
                http = validHttp;

                return validateMethod(this._prepareLogger, this._config, http, rawMethod);
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
    addMethods (methods) {

        return new Promise((resolve, reject) => {

            this._prepareLogger.debug({record: Object.keys(methods)}, 'addMethods');

            var methodsParamType = kindOf(methods);

            if (methodsParamType !== 'object') {
                return reject(
                    HttpError.createError(HttpError.CODES.INVALID_ARGS)
                        .bind({
                            method: 'addMethods',
                            param: 'methods',
                            validType: 'object',
                            type: methodsParamType,
                            value: this._json(methods)
                        })
                );
            }

            var promises = [];

            for (var http in methods) {
                this._prepareLogger.trace({record: http}, 'addMethods => addMethod');
                promises.push(this.addMethod(http, methods[http]));
            }

            Promise.all(promises)
                .then(() => {
                    resolve();
                })
                .catch(reject);
        });


    }

    /**
     * add rest methods to express app
     *
     * @param {Express} app
     * @param {Object} di
     * @return {Promise}
     */
    init (app, di) {
        // app should be express app

        return new Promise((resolve, reject) => {

            this._logger.debug('init');

            app.use(expressMiddlewares.requestId(this._logger));

            if (this._config.responseTimeout) {
                app.locals.responseTimeout = this._config.responseTimeout;
            }

            var promises = [];

            for (var id in this._methods) {

                promises.push(
                    addExpressMethod(
                        this._logger,
                        this._config,
                        this.requestHelpers,
                        this.responseHelpers,
                        app,
                        di,
                        this._endpoint,
                        this._methods[id]
                    )
                );

            }

            Promise.all(promises)
                .then((expressMethods) => {
                    for (var i in expressMethods) {
                        var method = expressMethods[i];

                        if (this._beforeResponseMiddleware) {
                            method.args.push(this._beforeResponseMiddleware);
                        }

                        app[method.httpMethod].apply(app, method.args);
                    }
                    resolve();
                })
                .catch(reject);

        });

    }

    setBeforeResponseMiddleware (fn) {
        this._logger.debug('setBeforeResponseMiddleware');
        // TODO validate and error
        this._beforeResponseMiddleware = fn;
        return this;
    }

    /**
     * @private
     * @param {Logger} logger
     * @return {Logger}
     */
    _validateLogger (logger) {

        if (!logger) {
            return {
                debug: function () {},
                trace: function () {}
            };
        }

        // TODO validate logger
        return logger;
    }

    /**
     * @private
     * @param {Object} config
     * @return {Object}
     */
    _validateConfig (config) {
        // TODO check config
        if (!config) {

            return {
                strictResourceValidation: false,
                strictMethodValidation: false,
                responseTimeout: 1 * 60 * 1000 // 1 minutes
            };

        }

        return config;
    }

    /**
     * @param {*} value
     * @return {String}
     */
    _json (value) {
        return JSON.stringify(value);
    }
}

module.exports = Http;
