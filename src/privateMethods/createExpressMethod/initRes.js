module.exports = function createMiddlewareInitRes(logger, helpers) {
    logger.trace('init response helpers and send middleware');

    return function middlewareInitRes(req, res, next) {
        req.logger.trace('init response helpers');

        Object.keys(helpers).forEach((name) => {
            res[name] = helpers[name].bind(res, next);
        });

        req.logger.trace('init res.send function');

        const send = res.send;

        res.send = function reassignedExpressSend(...args) {
            req.logger.trace({record: args}, 'call res.send');

            if (res.timeout !== null) {
                clearTimeout(res.timeout);
            }

            if (res.headersSent) {
                return req.logger.error(
                    new Error('middlewareInitReq.reassignedExpressSend, headers already sent')
                );
            }

            send.apply(res, args);

            const responseTime = this.ctx.time.total;

            return req.logger.trace(`response sent in ${responseTime}ms`);
        };

        next();
    };
};
