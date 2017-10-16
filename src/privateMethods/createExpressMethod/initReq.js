module.exports = function createMiddlewareInitReq(logger, rawMethod, helpers) {
    logger.trace('init request helpers middleware');

    return function middlewareInitReq(req, res, next) {
        req.logger.trace('init request helpers');

        req.ctx.routeName = `${rawMethod.http.method.toUpperCase()}${rawMethod.http.path}`;

        Object.keys(helpers).forEach((name) => {
            req[name] = helpers[name].bind(req, next);
        });

        next();
    };
};
