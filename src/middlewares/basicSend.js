module.exports = function middlewareBasicSend(error, req, res, next) {
    if (error === 'send') {
        res.requestEnd();
        const {ctx} = res;
        res.status(ctx.status);
        return res.json(ctx.body);
    }

    return next(error);
};
