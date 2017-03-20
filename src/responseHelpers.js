module.exports = {
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
    }
};
