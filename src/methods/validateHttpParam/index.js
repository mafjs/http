var joi = require('joi');

var HttpError = require('../../Error');

var prepare = require('./prepare');

var createHttpParamSchema = function () {

    return joi.object().required().keys({
        method: joi.string().required().trim().valid(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']),
        path: joi.alternatives().try(joi.string().trim(), joi.array(), joi.object().type(RegExp))
    });

};

module.exports = function (logger, config, httpParam) {

    return new Promise((resolve, reject) => {

        logger.debug('validate http param', httpParam);

        httpParam = prepare(logger, httpParam);

        var schema = createHttpParamSchema();

        var options = {
            allowUnknown: false,
            convert: true,
            abortEarly: true
        };

        joi.validate(httpParam, schema, options, function (error, valid) {
            if (error) {
                return reject(
                    HttpError.createError(
                        HttpError.CODES.INVALID_HTTP_PARAM_OBJECT,
                        error
                    )
                );
            }

            resolve(valid);
        });
    });



};
