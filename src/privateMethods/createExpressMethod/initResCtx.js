module.exports = function createMiddlewareInitResCtx(logger) {
    logger.trace('init res.ctx middleware');

    return function initResCtx(req, res, next) {
        res.ctx = {
            time: {
                start: req.startTime || new Date(),
                end: null,
                total: null
            },
            status: null,
            headers: {},
            // TODO
            cookies: {},
            body: null
        };

        req.logger.trace({record: res.ctx}, 'init res.ctx');

        next();
    };
};
