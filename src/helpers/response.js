module.exports = {
    // requestStart: function () {
    //     this.httpContext.time.start = new Date();
    // },

    requestEnd(/* next */) {
        if (this.ctx.time.end) {
            return;
        }

        const {start} = this.ctx.time;
        const end = new Date();

        this.ctx.time.end = end;

        this.ctx.time.total = end.getTime() - start.getTime();
    },

    time(next, name) {
        if (!name) {
            // TODO Error
            return;
        }

        this.ctx.time[name] = new Date();
    },

    timeEnd(next, name) {
        if (!this.ctx.time[name]) {
            // TODO ERROR
            return;
        }

        const now = (new Date()).getTime();

        const start = this.ctx.time[name].getTime();

        this.ctx.time[name] = now - start;
    },

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
