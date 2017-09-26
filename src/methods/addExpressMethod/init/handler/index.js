var init = {
    responseTimeout: require('./initResponseTimeout')
};


module.exports = function (logger, app, httpMethod, httpPath, middlewares, method) {

    logger.debug('init request handler');

    var args = [httpPath, middlewares];

    args.push(function (req, res, next) {

        init.responseTimeout(logger, req, res, next, method);

        req.logger.trace(`call method handler for ${httpMethod.toUpperCase()} ${httpPath}`);

        res.httpContextNext = function (error) {

            if (res.timeout) {
                clearTimeout(res.timeout);
            }

            next(error);

        };

        method.handler(req, res, next);

    });

    return {
        httpMethod: httpMethod,
        args: args
    };

};
