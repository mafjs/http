var validate = require('./validate');

var HttpError = require('../../../Error');

module.exports = function (logger, middlewares, method) {

    if (method.schema.headers) {
        logger.trace('add headers validation for ' + method.http);

        middlewares.push(function (req, res, next) {
            req.logger.trace({record: req.params}, 'validate headers');

            validate(req.headers, method.schema.headers)
                .then((valid) => {
                    req.headers = valid;
                    next();
                })
                .catch((originalError) => {
                    var error = HttpError.createError(HttpError.CODES.INVALID_REQUEST_DATA, originalError);

                    error.requestPart = 'headers';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }

};
