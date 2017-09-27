const kindOf = require('maf-kind-of');
const HttpError = require('./Error');

const validateConfig = require('./privateMethods/validateConfig');
const validateHttpParam = require('./privateMethods/validateHttpParam');
const validateMethod = require('./privateMethods/validateMethod');

class Http {
    constructor(logger, config) {
        this.Error = HttpError;

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

        const methodId = this._methodInc + 1;

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
}

module.exports = Http;
