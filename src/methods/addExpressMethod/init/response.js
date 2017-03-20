module.exports = function (logger, middlewares, responseHelpers) {

    middlewares.push(function (req, res, next) {

        for (var name in responseHelpers) {
            res[name] = responseHelpers[name].bind(res);
        }

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
