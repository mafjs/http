var init = {
    responseTimeout: require('./initResponseTimeout')
};


module.exports = function (logger, app, httpMethod, httpPath, middlewares, handler) {

    logger.debug('init request handler');

    app[httpMethod](httpPath, middlewares, function (req, res, next) {

        init.responseTimeout(logger, req, res, next);

        res.httpContextNext = function () {

            if (res.timeout) {
                clearTimeout(res.timeout);
            }

            next();

        };

        handler(req, res, next);

    });


};
