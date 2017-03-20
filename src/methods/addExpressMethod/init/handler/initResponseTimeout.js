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
        return;
    }

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
