const uuid = require('uuid/v4');

module.exports = function createMiddlewareRequestId(logger) {
    return function MiddlewareRequestId(req, res, next) {
        req.id = null;

        if (req.headers && req.headers['x-request-id']) {
            req.id = req.headers['x-request-id'];
        }

        if (!req.id) {
            req.id = uuid();
            res.set('X-Request-Id', req.id);
        }

        if (!req.logger) {
            req.logger = logger.getLogger('request', {req_id: req.id});
        }

        if (typeof req.query._trace !== 'undefined') {
            req.logger.level('trace');
        } else if (typeof req.query._debug !== 'undefined') {
            req.logger.level('debug');
        }

        req.logger.trace('request started');

        next();
    };
};
