const validate = require('./validate');

const HttpError = require('../../Error');

module.exports = function initMiddlewarePathValidation(logger, middlewares, schema) {
    if (schema) {
        logger.trace('add query params validation middleware');

        middlewares.push((req, res, next) => {
            req.logger.trace({ record: req.query }, 'validate path params');

            validate(req.query, schema)
                .then((valid) => {
                    req.rawParams = req.params;
                    req.params = valid;
                    next();
                })
                .catch((originalError) => {
                    const error = HttpError.createError(
                        HttpError.CODES.INVALID_REQUEST_DATA,
                        originalError
                    );

                    error.message = 'invalid path params';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }
};
