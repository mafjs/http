var joi = require('joi');

var HttpError = require('../Error');

var createMethodSchema = function () {
    return joi.object()
        .required()
        // this option can be changed with config.strictMethodValidation = true
        .unknown(true)
        .keys({
            name: joi.string(),
            title: joi.string(),
            description: joi.string(),
            schema: joi.object()
                // this option can be changed with config.strictMethodValidation = true
                .unknown(false)
                .keys({
                    path: joi.object(),             // every object here should be a joi schema object
                    query: joi.object().keys({}),   // req.query
                    headers: joi.object().keys({}), // req.headers
                    body: joi.object().keys({}),    // req.body
                    cookies: joi.object().keys({})  // req.cookies
                }),
            handler: joi.func().required()
        });
};


module.exports = function (logger, config, httpParam, rawMethod) {

    return new Promise((resolve, reject) => {

        var methodSchema = createMethodSchema();

        var options = {
            allowUnknown: true,
            convert: false,
            abortEarly: true
        };

        logger.debug('validate method', httpParam, rawMethod);

        joi.validate(rawMethod, methodSchema, options, function (error, valid) {

            if (error) {
                return reject(
                    HttpError.createError(
                        HttpError.CODES.INVALID_METHOD_OBJECT,
                        error
                    )
                    .bind(httpParam)
                );

            }

            resolve(valid);

        });

    });

};
