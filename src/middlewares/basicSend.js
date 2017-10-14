module.exports = function middlewareBasicSend(error, req, res, next) {
    if (error === 'send') {
        res.requestEnd();
        const {ctx} = res;
        res.status(ctx.status);

        if (ctx.headers && Object.keys(ctx.headers).length) {
            res.set(ctx.headers);
        }

        // console.log('ctx', req.ctx.name, res.ctx.time.total);

        // TODO send cookies

        return res.json(ctx.body);
    }

    return next(error);
};
