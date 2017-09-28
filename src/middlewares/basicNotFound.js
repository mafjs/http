module.exports = function middlewareBasicNotFound(req, res, next) {
    if (res.requestEnd) {
        res.requestEnd();
    }

    if (!res.ctx || !res.ctx.status) {
        req.logger.trace('basicMiddlewareNotFound, send 404 RESOURCE_NOT_FOUND');

        return res.status(404).json({
            error: {
                message: 'resource not found',
                code: 'RESOURCE_NOT_FOUND'
            }
        });
    }

    return next(new this.Error('has res.ctx, but not send'));
};
