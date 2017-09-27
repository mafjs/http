module.exports = function createMiddlewareInitReq(logger, helpers) {
    logger.trace('init request helpers middleware');

    return function middlewareInitReq(req, res, next) {
        req.logger.trace('init request helpers');

        Object.keys(helpers).forEach((name) => {
            req[name] = helpers[name].bind(req, next);
        });

        next();
    };
};
