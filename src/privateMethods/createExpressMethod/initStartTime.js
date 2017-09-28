module.exports = function createMiddlewareInitStartTime(logger) {
    logger.trace('create initStartTime middleware');

    return function initStartTime(req, res, next) {
        const now = new Date();
        req.logger.trace(`init start time ${now.toISOString()}`);
        req.startTime = now;
        next();
    };
};
