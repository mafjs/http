const validate = require('./validate');

const HttpError = require('../../Error');

module.exports = function initMiddlewareHeadersValidation(logger, middlewares, schema) {
    if (schema) {
        logger.trace('add headers validation middleware');

        middlewares.push((req, res, next) => {
            req.logger.trace({record: req.headers}, 'validate headers');

            validate(req.headers, schema)
                .then((valid) => {
                    req.rawHeaders = req.headers;
                    req.headers = valid;
                    next();
                })
                .catch((originalError) => {
                    const error = HttpError.createError(
                        HttpError.CODES.INVALID_REQUEST_DATA,
                        originalError
                    );

                    error.requestPart = 'invalid headers';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }
};
