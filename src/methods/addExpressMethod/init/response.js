var responseHelpers = require('./responseHelpers');

module.exports = function (logger, middlewares) {

    middlewares.push(function (req, res, next) {
        res = Object.assign(res, responseHelpers);

        var send = res.send;

        res.send = function () {

            if (res.timeout !== null) {
                clearTimeout(res.timeout);
            }

            if (res.headersSent) {
                // TODO Error, warning
                return;
            }

            send.apply(res, arguments);

        };

        next();
    });

};
