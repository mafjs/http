var validate = require('./validate');

var HttpError = require('../../../Error');

module.exports = function (logger, middlewares, method) {

    if (method.schema.body) {
        logger.trace('add body validation for ' + method.http);

        middlewares.push(function (req, res, next) {
            req.logger.trace({record: req.params}, 'validate body');

            validate(req.body, method.schema.body)
                .then((valid) => {
                    req.body = valid;
                    next();
                })
                .catch((originalError) => {
                    var error = HttpError.createError(HttpError.CODES.INVALID_REQUEST_DATA, originalError);

                    error.requestPart = 'body';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }

};
