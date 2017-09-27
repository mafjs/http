const validate = require('./validate');

const HttpError = require('../../Error');

module.exports = function initMiddlewareBodyValidation(logger, middlewares, schema) {
    if (schema) {
        logger.trace('add body validation middleware');

        middlewares.push((req, res, next) => {
            req.logger.trace({ record: req.params }, 'validate body params');

            validate(req.body, schema)
                .then((valid) => {
                    req.body = valid;
                    next();
                })
                .catch((originalError) => {
                    const error = HttpError.createError(
                        HttpError.CODES.INVALID_REQUEST_DATA,
                        originalError
                    );

                    error.requestPart = 'invalid body';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }
};
