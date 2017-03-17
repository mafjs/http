var joi = require('joi');

var HttpError = require('../Error');

var resourceSchema = joi.object()
    .required()
    .unknown(true) // this option can be changed with config.strictResourceValidation = true
    .keys({
        name: joi.string().required(),
        path: joi.string().required(), // TODO validate uri path
        title: joi.string(),
        description: joi.string(),
        methods: joi.object()
            .required()
            .unknown(false) // this option can be changed with config.strictResourceValidation = true
            .min(1)
            .keys({
                GET: joi.object().keys({ /* method schema */}),
                POST: joi.object().keys({ /* method schema */}),
                PATCH: joi.object().keys({ /* method schema */}),
                PUT: joi.object().keys({ /* method schema */}),
                DELETE: joi.object().keys({ /* method schema */}),
                OPTIONS: joi.object().keys({ /* method schema */}),
            })
    });

module.exports = function (logger, config, rawResource) {

    return new Promise((resolve, reject) => {

        var options = {
            allowUnknown: true
        };

        joi.validate(
            rawResource,
            resourceSchema,
            options,
            function (error, valid) {
                if (error) {
                    return reject(
                        HttpError.createError(
                            HttpError.CODES.INVALID_RESOURCE_OBJECT,
                            error
                        )
                    );
                }

                resolve(valid);
            }
        );

    });

};
