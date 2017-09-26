var HttpError = require('../../../../Error');

var getResponseTimeoutDelay = function (req, method) {
    if (method.responseTimeout) {
        return method.responseTimeout;
    }

    if (req.app && req.app.locals && req.app.locals.responseTimeout) {
        return Number(req.app.locals.responseTimeout);
    } else {
        return null;
    }
};

module.exports = function (logger, req, res, next, method) {

    var timeoutDelay = getResponseTimeoutDelay(req, method);

    if (!timeoutDelay) {
        req.logger.trace('no response timeout');
        return;
    }

    req.logger.trace({record: timeoutDelay}, 'init response timeout');

    res.timeout = setTimeout(function () {

        if (res.headersSent) {
            // TODO error or not?
            return;
        }

        next(
            HttpError.createError(HttpError.CODES.RESPONSE_TIMEOUT)
                .bind({
                    delay: timeoutDelay
                })
        );

    }, timeoutDelay);

};
