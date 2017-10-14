let t = require('tap');
let proxyquire = require('proxyquire');

let root = '../../../package';

let HttpError = require(root + '/Error');


t.test('should return promise', function(t) {
    let validateHttpParam = proxyquire(root + '/methods/validateHttpParam', {
        joi: {
            validate: function() {}
        }
    });

    let logger = {
        debug: function() {},
        trace: function() {}
    };

    let promise = validateHttpParam(logger);

    t.type(promise.then, 'function');
    t.type(promise.catch, 'function');

    t.end();
});

t.test('should call joi.validate', function(t) {
    let logger = {
        debug: function() {},
        trace: function() {}
    };

    let config = {a: 1};

    let raw = {
        method: 'GET',
        path: '/'
    };

    let validateHttpParam = proxyquire(root + '/methods/validateHttpParam', {

        joi: {
            validate: function(value) {
                t.same(value, raw);
                t.end();
            }
        }

    });

    validateHttpParam(logger, config, raw);
});

t.test('should call validateHttpParam/prepare fn', function(t) {
    let logger = {
        debug: function() {},
        trace: function() {}
    };

    let config = {a: 1};

    let raw = {
        method: 'GET',
        path: '/'
    };

    let validateHttpParam = proxyquire(root + '/methods/validateHttpParam', {

        './prepare': function() {
            t.end();
        },

        'joi': {
            validate: function() {

            }
        }

    });

    validateHttpParam(logger, config, raw);
});

t.test('should resolve promise with valid data, if rawHttpParam valid', function(t) {
    let validateHttpParam = proxyquire(root + '/methods/validateHttpParam', {
        joi: {
            validate: function(value, schema, options, callback) {
                callback(null, {a: 1});
            }
        }
    });

    let logger = {
        debug: function() {},
        trace: function() {}
    };

    validateHttpParam(logger)
            .then(function(valid) {
                t.same(valid, {a: 1});
                t.end();
            })
            .catch(t.threw);
});

// eslint-disable-next-line max-len
t.test('should reject HttpError code = INVALID_HTTP_PARAM_OBJECT, if validation fails', function(t) {
    let validateHttpParam = proxyquire(root + '/methods/validateHttpParam', {
        joi: {
            validate: function(value, schema, options, callback) {
                callback(new Error('validation fails'));
            }
        }
    });

    let logger = {
        debug: function() {},
        trace: function() {}
    };

    validateHttpParam(logger)
            .then(function() {
                t.threw(new Error('should reject'));
            })
            .catch(function(error) {
                t.ok(error instanceof HttpError);
                t.equal(error.code, HttpError.CODES.INVALID_HTTP_PARAM_OBJECT);
                t.end();
            });
});
