module.exports = function createMiddlewareInitReq(logger, helpers) {
    logger.trace('init response helpers and send middleware');

    return function middlewareInitReq(req, res, next) {
        req.logger.trace('init response helpers');

        Object.keys(helpers).forEach((name) => {
            res[name] = helpers[name].bind(res, next);
        });

        req.logger.trace('init res.send function');

        // eslint-disable-next-line prefer-destructuring
        const send = res.send;

        res.send = function reassignedExpressSend() {
            // eslint-disable-next-line prefer-rest-params
            req.logger.trace({record: arguments}, 'call res.send');

            if (res.timeout !== null) {
                clearTimeout(res.timeout);
            }

            if (res.headersSent) {
                return req.logger.error(
                    new Error('middlewareInitReq.reassignedExpressSend, headers already sent')
                );
            }

            // eslint-disable-next-line prefer-rest-params
            send.apply(res, arguments);

            const responseTime = this.ctx.time.total;

            return req.logger.trace(`response sent in ${responseTime}ms`);
        };

        next();
    };
};
