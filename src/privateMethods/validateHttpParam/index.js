const joi = require('joi');

const HttpError = require('../../Error');

const prepare = require('./prepare');

const createHttpParamSchema = function createHttpParamSchema() {
    return joi.object().required().keys({
        method: joi.string().required().trim().valid(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']),
        path: joi.alternatives().try(joi.string().trim(), joi.array(), joi.object().type(RegExp))
    });
};

module.exports = function validateHttpParam(logger, config, rawHttpParam) {
    return new Promise((resolve, reject) => {
        logger.trace({ record: rawHttpParam }, 'validate http param');

        const httpParam = prepare(logger, rawHttpParam);

        const schema = createHttpParamSchema();

        const options = {
            allowUnknown: false,
            convert: true,
            abortEarly: true
        };

        joi.validate(httpParam, schema, options, (error, valid) => {
            if (error) {
                return reject(HttpError.createError(
                    HttpError.CODES.INVALID_HTTP_PARAM_OBJECT,
                    error
                ));
            }

            return resolve(valid);
        });
    });
};
