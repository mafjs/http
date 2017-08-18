var uuid = require('uuid/v4');

module.exports = function (req, res, next) {
    if (!req.id) {
        req.id = uuid();
        res.set('X-Request-Id', req.id);
    }

    next();
};
