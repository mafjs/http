const HttpError = require('../../Error');

const getResponseTimeoutDelay = function getResponseTimeoutDelay(req, timeout) {
    if (timeout) {
        return timeout;
    }

    if (req.app && req.app.locals && req.app.locals.responseTimeout) {
        return Number(req.app.locals.responseTimeout);
    }

    return null;
};

module.exports = function initMiddlewareResponseTimeout(logger, timeout) {
    logger.trace('add res.timeout middleware');

    return function middlewareResponseTimeout(req, res, next) {
        const timeoutDelay = getResponseTimeoutDelay(req, timeout);

        if (!timeoutDelay) {
            req.logger.trace('middlewareResponseTimeout, no response timeout');
            return;
        }

        req.logger.trace({ record: timeoutDelay }, 'init response timeout');

        res.timeout = setTimeout(() => {
            if (res.headersSent) {
                return req.logger.error(new Error('middlewareResponseTimeout, header already sent'));
            }

            const error = HttpError.createError(HttpError.CODES.RESPONSE_TIMEOUT)
                .bind({
                    delay: timeoutDelay
                });

            return next(error);
        }, timeoutDelay);

        next();
    };
};
