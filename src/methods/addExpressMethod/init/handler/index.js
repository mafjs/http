var init = {
    responseTimeout: require('./initResponseTimeout')
};


module.exports = function (logger, app, httpMethod, httpPath, middlewares, method) {

    logger.debug('init request handler');

    app[httpMethod](httpPath, middlewares, function (req, res, next) {

        init.responseTimeout(logger, req, res, next, method);

        res.httpContextNext = function (error) {

            if (res.timeout) {
                clearTimeout(res.timeout);
            }

            next(error);

        };

        method.handler(req, res, next);

    });


};
