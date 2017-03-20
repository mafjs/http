var validate = require('./validate');

var HttpError = require('../../../Error');

module.exports = function (logger, middlewares, method) {

    if (method.schema.cookies) {
        logger.trace('add cookies validation for ', method.http);

        middlewares.push(function (req, res, next) {
            validate(req.cookies, method.schema.cookies)
                .then((valid) => {
                    req.cookies = valid;
                    next();
                })
                .catch((originalError) => {
                    var error = HttpError.createError(HttpError.CODES.INVALID_REQUEST_DATA, originalError);

                    error.requestPart = 'cookies';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }

};
