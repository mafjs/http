let t = require('tap');
let proxyquire = require('proxyquire');

let root = '../../../package';

let HttpError = require(root + '/Error');


t.test('should return promise', function(t) {
    let validateResource = proxyquire(root + '/methods/validateResource', {
        joi: {
            validate: function() {}
        }
    });

    let promise = validateResource();

    t.type(promise.then, 'function');
    t.type(promise.catch, 'function');

    t.end();
});

t.test('should call joi.validate', function(t) {
    let logger = {debug: function() {}};

    let config = {a: 1};

    let raw = {
        path: '',
        methods: {
            GET: {},
            POST: {}
        }
    };

    let validateResource = proxyquire(root + '/methods/validateResource', {
        joi: {
            validate: function(value /* , schema, options, callback */) {
                t.same(value, raw);
                t.end();
            }
        }
    });

    validateResource(logger, config, raw);
});

t.test('should resolve promise with valid data, if rawResource valid', function(t) {
    let validateResource = proxyquire(root + '/methods/validateResource', {
        joi: {
            validate: function(value, schema, options, callback) {
                callback(null, {a: 1});
            }
        }
    });

    validateResource()
            .then(function(valid) {
                t.same(valid, {a: 1});
                t.end();
            })
            .catch(t.threw);
});


t.test('should reject HttpError with INVALID_RESOURCE_OBJECT, if validation fails', function(t) {
    let validateResource = proxyquire(root + '/methods/validateResource', {
        joi: {
            validate: function(value, schema, options, callback) {
                callback(new Error('validation fails'));
            }
        }
    });

    validateResource()
            .then(function() {
                t.threw(new Error('should reject'));
            })
            .catch(function(error) {
                t.ok(error instanceof HttpError);
                t.equal(error.code, HttpError.CODES.INVALID_RESOURCE_OBJECT);
                t.end();
            });
});
