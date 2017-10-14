const joi = require('joi');

const HttpError = require('../../Error');

const prepare = require('./prepare');

const createMethodSchema = function createMethodSchema() {
    return (
        joi
            .object()
            .required()
            // this option can be changed with config.strictMethodValidation = true
            .unknown(true)
            .keys({
                name: joi.string(),
                title: joi.string(),
                description: joi.string(),
                timeout: joi.number().integer().min(1),
                schema: joi.object()
                    // this option can be changed with config.strictMethodValidation = true
                    .unknown(false)
                    .keys({
                        path: joi.object(), // every object here should be a joi schema object
                        query: joi.object().keys({}), // req.query
                        headers: joi.object().keys({}), // req.headers
                        body: joi.object().keys({}), // req.body
                        cookies: joi.object().keys({}) // req.cookies
                    }),
                handler: joi.func().required(),
                beforeMethodCreation: joi.func()
            })
    );
};

const methodSchema = createMethodSchema();

module.exports = function validateMethod(logger, config, httpParam, raw) {
    return new Promise((resolve, reject) => {
        const rawMethod = prepare(logger, raw);

        // var resourceSchema = createMethodSchema();

        const options = {
            allowUnknown: true,
            convert: false,
            abortEarly: true
        };

        logger.trace({record: httpParam}, 'validate method');

        joi.validate(rawMethod, methodSchema, options, (error, valid) => {
            if (error) {
                const exception = HttpError.createError(
                    HttpError.CODES.INVALID_METHOD_OBJECT,
                    error
                );

                exception.bind(httpParam);

                return reject(exception);
            }

            return resolve(valid);
        });
    });
};
