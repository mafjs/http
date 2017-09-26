module.exports = function (logger, middlewares, requestHelpers, responseHelpers) {

    middlewares.push(function (req, res, next) {

        req.logger.trace('init request helpers');

        for (var reqHelperName in requestHelpers) {
            req[reqHelperName] = requestHelpers[reqHelperName].bind(req);
        }

        req.logger.trace('init response helpers');

        for (var resHelperName in responseHelpers) {
            res[resHelperName] = responseHelpers[resHelperName].bind(res);
        }

        req.logger.trace('init res.send function');

        var send = res.send;

        res.send = function () {

            req.logger.trace({record: arguments}, 'call res.send');

            if (res.timeout !== null) {
                clearTimeout(res.timeout);
            }

            // if (res.headersSent) {
            //     // TODO Error, warning
            //     return;
            // }

            send.apply(res, arguments);

            req.logger.trace('response sent');

        };

        next();

    });

};
