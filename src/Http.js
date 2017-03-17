var kindOf = require('maf-kind-of');
var HttpError = require('./Error');

var validateHttpParam = require('./methods/validateHttpParam');
var validateMethod = require('./methods/validateMethod');
var addExpressMethod = require('./methods/addExpressMethod');

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

        this._logger = this._validateLogger(logger);
        this._config = this._validateConfig(config);

        this._endpoint = {
            title: null,
            description: null,
            path: null
        };

        this._methods = [];
    }

    /**
     * set endpoint
     *
     * @param {String|Object} endpoint
     */
    setEndpoint (endpoint) {
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

        this._logger.debug('addMethod', rawHttp, rawMethod);

        var http = null;
        var method = null;

        return Promise.resolve()
            .then(() => {
                return validateHttpParam(this._logger, this._config, rawHttp);
            })
            .then((validHttp) => {
                http = validHttp;

                return validateMethod(this._logger, this._config, http, rawMethod);
            })
            .then((validMethod) => {
                method = validMethod;

                method.http = http;

                this._methods.push(method);

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

            this._logger.debug('addMethods', methods);

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
                this._logger.debug('addMethods => addMethod', http, methods[http]);
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
     * @return {Promise}
     */
    init (app) {
        // app should be express app

        return new Promise((resolve, reject) => {

            var promises = [];

            for (var i in this._methods) {

                promises.push(
                    addExpressMethod(
                        this._logger,
                        this._config,
                        app,
                        this._endpoint,
                        this._methods[i]
                    )
                );

            }

            Promise.all(promises)
                .then(() => {
                    resolve();
                })
                .catch(reject);

        });

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
                strictMethodValidation: false
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
