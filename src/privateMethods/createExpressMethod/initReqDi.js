module.exports = function createMiddlewareInitReqDi(logger, di) {
    logger.trace('init req.di middleware');

    return function initReqDi(req, res, next) {
        req.di = di;
        req.logger.trace('init req.di');
        next();
    };
};
