module.exports = function (logger, middlewares, requestHelpers, responseHelpers) {

    middlewares.push(function (req, res, next) {

        for (var reqHelperName in requestHelpers) {
            req[reqHelperName] = requestHelpers[reqHelperName].bind(req);
        }

        for (var resHelperName in responseHelpers) {
            res[resHelperName] = responseHelpers[resHelperName].bind(res);
        }

        var send = res.send;

        res.send = function () {

            if (res.timeout !== null) {
                clearTimeout(res.timeout);
            }

            // if (res.headersSent) {
            //     // TODO Error, warning
            //     return;
            // }

            send.apply(res, arguments);

        };

        next();

    });

};
