const validate = require('./validate');

const HttpError = require('../../Error');

module.exports = function initMiddlewareCookiesValidation(logger, middlewares, schema) {
    if (schema) {
        logger.trace('add cookies validation middleware');

        middlewares.push((req, res, next) => {
            req.logger.trace({record: req.cookies}, 'validate cookies');

            validate(req.cookies, schema)
                .then((valid) => {
                    req.rawCookies = req.cookies;
                    req.cookies = valid;
                    next();
                })
                .catch((originalError) => {
                    const error = HttpError.createError(
                        HttpError.CODES.INVALID_REQUEST_DATA,
                        originalError
                    );

                    error.requestPart = 'invalid cookies';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }
};
