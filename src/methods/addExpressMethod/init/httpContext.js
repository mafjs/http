module.exports = function (logger, middlewares) {

    logger.debug('init httpContext');

    middlewares.push(function (req, res, next) {

        res.httpContext = {
            time: {
                start: new Date(),
                end: null,
                total: null
            },
            body: undefined
        };

        res.httpContextNext = function (error) {

            if (res.timeout) {
                clearTimeout(res.timeout);
            }

            next(error);

        };

        req.logger.trace({record: res.httpContext}, 'init res.httpContext and httpContextNext');

        next();
    });


};
