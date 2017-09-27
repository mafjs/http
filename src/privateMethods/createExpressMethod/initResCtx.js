module.exports = function createMiddlewareInitResCtx(logger) {
    logger.trace('init res.ctx middleware');

    return function initResCtx(req, res, next) {
        res.ctx = {
            time: {
                start: new Date(),
                end: null,
                total: null
            },
            status: null,
            headers: null,
            cookies: null,
            body: null
        };

        req.logger.trace('res.ctx inited');

        next();
    };
};
