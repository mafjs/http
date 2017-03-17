var t = require('tap');
var proxyquire = require('proxyquire');

var root = '../../../package';

var HttpError = require(root + '/Error');


t.test('should return promise', function (t) {

    var validateResource = proxyquire(root + '/methods/validateResource', {
        joi: {
            validate: function () {}
        }
    });

    var promise = validateResource();

    t.type(promise.then, 'function');
    t.type(promise.catch, 'function');

    t.end();

});

t.test('should call joi.validate', function (t) {

    var logger = {debug: function () {}};

    var config = {a: 1};

    var raw = {
        path: '',
        methods: {
            GET: {},
            POST: {}
        }
    };

    var validateResource = proxyquire(root + '/methods/validateResource', {
        joi: {
            validate: function (value /*, schema, options, callback */) {
                t.same(value, raw);
                t.end();
            }
        }
    });

    validateResource(logger, config, raw);

});

t.test('should resolve promise with valid data, if rawResource valid', function (t) {

    var validateResource = proxyquire(root + '/methods/validateResource', {
        joi: {
            validate: function (value, schema, options, callback) {
                callback(null, {a: 1});
            }
        }
    });

    validateResource()
            .then(function (valid) {
                t.same(valid, {a: 1});
                t.end();
            })
            .catch(t.threw);
});


t.test('should reject HttpError with INVALID_RESOURCE_OBJECT, if validation fails', function (t) {

    var validateResource = proxyquire(root + '/methods/validateResource', {
        joi: {
            validate: function (value, schema, options, callback) {
                callback(new Error('validation fails'));
            }
        }
    });

    validateResource()
            .then(function () {
                t.threw(new Error('should reject'));
            })
            .catch(function (error) {
                t.ok(error instanceof HttpError);
                t.equal(error.code, HttpError.CODES.INVALID_RESOURCE_OBJECT);
                t.end();
            });

});
