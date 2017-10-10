const has = require('lodash.has');
const get = require('lodash.get');
const pick = require('lodash.pick');

module.exports = {
    // check
    hasQueryParam(name) {
        return has(this.query, name);
    },
    hasPathParam(name) {
        return has(this.params, name);
    },
    hasBodyParam(name) {
        return has(this.body, name);
    },
    hasCookie(name) {
        return has(this.cookies, name);
    },
    hasHeader(name) {
        return this.is(name);
    },

    // get one
    getQueryParam(name, defaultValue) {
        return get(this.query, name, defaultValue);
    },
    getPathParam(name, defaultValue) {
        return get(this.params, name, defaultValue);
    },
    getBodyParam(name, defaultValue) {
        return get(this.body, name, defaultValue);
    },
    getCookie(name, defaultValue) {
        return get(this.cookies, name, defaultValue);
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
        return pick(this.query, names);
    },
    getPathParams(names) {
        return pick(this.params, names);
    },
    getBodyParams(names) {
        return pick(this.body, names);
    },
    getCookies(names) {
        return pick(this.cookies, names);
    },
    // TODO getHeaders
};
