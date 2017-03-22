var _has = require('lodash.has');
var _get = require('lodash.get');
var _pick = require('lodash.pick');

module.exports = {
    // check
    hasQueryParam: function (name) {
        return _has(this.query, name);
    },
    hasPathParam: function (name) {
        return _has(this.params, name);
    },
    hasBodyParam: function (name) {
        return _has(this.body, name);
    },
    hasCookie: function (name) {
        return _has(this.cookies, name);
    },
    hasHeader: function (name) {
        return this.is(name);
    },

    // get one
    getQueryParam: function (name, defaultValue) {
        return _get(this.query, name, defaultValue);
    },
    getPathParam: function (name, defaultValue) {
        return _get(this.params, name, defaultValue);
    },
    getBodyParam: function (name, defaultValue) {
        return _get(this.body, name, defaultValue);
    },
    getCookie: function (name, defaultValue) {
        return _get(this.cookies, name, defaultValue);
    },
    getHeader: function (name, defaultValue) {
        var header = this.get(name);

        if (typeof header === 'undefined') {
            return defaultValue;
        }

        return header;
    },

    // get many
    getQueryParams: function (names) {
        return _pick(this.query, names);
    },
    getPathParams: function (names) {
        return _pick(this.params, names);
    },
    getBodyParams: function (names) {
        return _pick(this.body, names);
    },
    getCookies: function (names) {
        return _pick(this.cookies, names);
    },
    // TODO getHeaders
};
