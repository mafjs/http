let t = require('tap');
let proxyquire = require('proxyquire');

let root = '../../../package';

let HttpError = require(root + '/Error');


t.test('should return promise', function(t) {
    let validateMethod = proxyquire(root + '/methods/validateMethod', {
        joi: {
            validate: function() {}
        }
    });

    let logger = {
        debug: function() {},
        trace: function() {}
    };

    let promise = validateMethod(logger);

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

    let method = 'GET';

    let raw = {
        path: '',
        methods: {
            GET: {},
            POST: {}
        }
    };

    let validateMethod = proxyquire(root + '/methods/validateMethod', {
        joi: {
            validate: function(value /* , schema, options, callback */) {
                t.same(value, raw);
                t.end();
            }
        }
    });

    validateMethod(logger, config, method, raw);
});

t.test('should resolve promise with valid data, if rawMethod valid', function(t) {
    let validateMethod = proxyquire(root + '/methods/validateMethod', {
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

    validateMethod(logger)
            .then(function(valid) {
                t.same(valid, {a: 1});
                t.end();
            })
            .catch(t.threw);
});


t.test('should reject HttpError code = INVALID_METHOD_OBJECT, if validation fails', function(t) {
    let validateMethod = proxyquire(root + '/methods/validateMethod', {
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

    validateMethod(logger)
            .then(function() {
                t.threw(new Error('should reject'));
            })
            .catch(function(error) {
                t.ok(error instanceof HttpError);
                t.equal(error.code, HttpError.CODES.INVALID_METHOD_OBJECT);
                t.end();
            });
});

t.test('should call prepare method internally', function(t) {
    let validateMethod = proxyquire(root + '/methods/validateMethod', {
        joi: {
            validate: function(value, schema, options, callback) {
                callback(null, {a: 1});
            }
        },
        prepare: function(/* logger, rawMethod*/) {
            t.end();
        }
    });

    let logger = {
        debug: function() {},
        trace: function() {}
    };

    return validateMethod(logger);
});


t.test('prepare method', function(t) {
    t.test('should return object if raw is object', function(t) {
        let logger = {};

        let raw = {handler: 'this_is_function'};

        let prepare = proxyquire(root + '/methods/validateMethod/prepare', {});

        t.same(prepare(logger, raw), {handler: 'this_is_function'});

        t.end();
    });

    t.test('should return object if raw is function', function(t) {
        let logger = {
            debug: () => {},
            trace: () => {},
            getLogger: () => this // eslint-disable-line no-invalid-this
        };

        let raw = function() {};

        let prepare = proxyquire(root + '/methods/validateMethod/prepare', {});

        let result = prepare(logger, raw);

        t.equal(Object.keys(result).length, 1);

        t.type(result.handler, 'function');

        t.end();
    });

    t.end();
});
