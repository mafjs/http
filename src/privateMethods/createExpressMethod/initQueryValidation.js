const validate = require('./validate');

const HttpError = require('../../Error');

module.exports = function initMiddlewareQueryValidation(logger, middlewares, schema) {
    if (schema) {
        logger.trace('add path params validation middleware');

        middlewares.push((req, res, next) => {
            req.logger.trace({ record: req.query }, 'validate query params');

            validate(req.query, schema)
                .then((valid) => {
                    req.rawQuery = req.query;
                    req.query = valid;
                    next();
                })
                .catch((originalError) => {
                    const error = HttpError.createError(
                        HttpError.CODES.INVALID_REQUEST_DATA,
                        originalError
                    );

                    error.message = 'invalid query params';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }
};
