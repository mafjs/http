module.exports = {
    // requestStart: function () {
    //     this.httpContext.time.start = new Date();
    // },

    requestEnd(res /* , next */) {
        if (res.ctx.time.end) {
            return;
        }

        const {start} = res.ctx.time;
        const end = new Date();

        res.ctx.time.end = end;

        res.ctx.time.total = end.getTime() - start.getTime();
    },

    time(res, next, name) {
        if (!name) {
            // TODO Error
            return;
        }

        res.ctx.time[name] = new Date();
    },

    timeEnd(res, next, name) {
        if (!res.ctx.time[name]) {
            // TODO ERROR
            return;
        }

        const now = (new Date()).getTime();

        const start = res.ctx.time[name].getTime();

        res.ctx.time[name] = now - start;
    }

    // TODO check express and http.ServerResponse method conflicts
    // alias for cookie()
    // setCookie: function (name, value, options) {
    //     return this.cookie(name, value, options);
    // },
    // alias for clearCookie
    // deleteCookie: function (name, options) {
    //     return this.clearCookie(name, options);
    // }
    // setHeader implemented in http.ServerResponse
    // setHeader: function (name, value) {
    //     return this.set(name, value);
    // }
};
