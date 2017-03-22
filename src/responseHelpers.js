module.exports = {
    // requestStart: function () {
    //     this.httpContext.time.start = new Date();
    // },

    requestEnd: function () {
        if (this.httpContext.time.end) {
            return;
        }

        var start = this.httpContext.time.start;
        var end = new Date();

        this.httpContext.time.end = end;

        this.httpContext.time.total = end.getTime() - start.getTime();
    },

    time: function (name) {
        if (!name) {
            // TODO Error
            return;
        }

        this.httpContext.time[name] = new Date();
    },

    timeEnd: function (name) {
        if (!this.httpContext.time[name]) {
            // TODO ERROR
            return;
        }

        var now = (new Date()).getTime();

        var start = this.httpContext.time[name].getTime();

        this.httpContext.time[name] = now - start;
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
