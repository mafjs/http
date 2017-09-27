const _has = require('lodash.has');
const _get = require('lodash.get');
const _pick = require('lodash.pick');

module.exports = {
    // check
    hasQueryParam(name) {
        return _has(this.query, name);
    },
    hasPathParam(name) {
        return _has(this.params, name);
    },
    hasBodyParam(name) {
        return _has(this.body, name);
    },
    hasCookie(name) {
        return _has(this.cookies, name);
    },
    hasHeader(name) {
        return this.is(name);
    },

    // get one
    getQueryParam(name, defaultValue) {
        return _get(this.query, name, defaultValue);
    },
    getPathParam(name, defaultValue) {
        return _get(this.params, name, defaultValue);
    },
    getBodyParam(name, defaultValue) {
        return _get(this.body, name, defaultValue);
    },
    getCookie(name, defaultValue) {
        return _get(this.cookies, name, defaultValue);
    },
    getHeader(name, defaultValue) {
        const header = this.get(name);

        if (typeof header === 'undefined') {
            return defaultValue;
        }

        return header;
    },

    // get many
    getQueryParams(names) {
        return _pick(this.query, names);
    },
    getPathParams(names) {
        return _pick(this.params, names);
    },
    getBodyParams(names) {
        return _pick(this.body, names);
    },
    getCookies(names) {
        return _pick(this.cookies, names);
    }
    // TODO getHeaders
};
