module.exports = function initRequestHandler(logger, httpMethod, route, handler) {
    logger.debug('init request handler');

    return function requestHandler(req, res, next) {
        req.logger.trace(`call method handler for ${httpMethod.toUpperCase()} ${route}`);

        handler(req, res, next);
    };
};
