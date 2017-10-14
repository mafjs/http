const uuid = require('uuid/v4');

module.exports = function createMiddlewareRequestId(logger) {
    return function MiddlewareRequestId(req, res, next) {
        req.ctx = {
            id: null,
            logger: null,
            name: null
            // name: `${req.method}${req.route}`
        };

        Object.defineProperty(req, 'id', {
            get: function() {
                return this.ctx.id;
            }
        });

        Object.defineProperty(req, 'logger', {
            get: function() {
                return this.ctx.logger;
            }
        });

        if (req.headers && req.headers['x-request-id']) {
            req.ctx.id = req.headers['x-request-id'];
        }

        if (!req.ctx.id) {
            req.ctx.id = uuid();
            res.set('X-Request-Id', req.id);
        }

        if (!req.ctx.logger) {
            req.ctx.logger = logger.getLogger('request', {req_id: req.ctx.id});
        }

        if (typeof req.query._trace !== 'undefined') {
            req.ctx.logger.level('trace');
        } else if (typeof req.query._debug !== 'undefined') {
            req.ctx.logger.level('debug');
        }

        req.ctx.logger.trace('request started');

        next();
    };
};
