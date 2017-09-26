var validate = require('./validate');

var HttpError = require('../../../Error');

module.exports = function (logger, middlewares, method) {

    if (method.schema.path) {
        logger.trace('add path params validation for ' + method.http);

        middlewares.push(function (req, res, next) {
            req.logger.trace({record: req.params}, 'validate path params');

            validate(req.params, method.schema.path)
                .then((valid) => {
                    req.params = valid;
                    next();
                })
                .catch((originalError) => {
                    var error = HttpError.createError(HttpError.CODES.INVALID_REQUEST_DATA, originalError);

                    error.requestPart = 'path';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }

};
