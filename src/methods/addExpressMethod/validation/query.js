var validate = require('./validate');

var HttpError = require('../../../Error');

module.exports = function (logger, middlewares, method) {

    if (method.schema.query) {
        logger.trace('add query params validation for ', method.http);

        middlewares.push(function (req, res, next) {
            validate(req.query, method.schema.query)
                .then((valid) => {
                    req.query = valid;
                    next();
                })
                .catch((originalError) => {
                    var error = HttpError.createError(HttpError.CODES.INVALID_REQUEST_DATA, error);

                    error.requestPart = 'query';
                    error.details = originalError.details;

                    next(error);
                });
        });
    }

};
