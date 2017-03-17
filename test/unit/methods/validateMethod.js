var t = require('tap');
var proxyquire = require('proxyquire');

var root = '../../../package';

var HttpError = require(root + '/Error');


t.test('should return promise', function (t) {

    var validateMethod = proxyquire(root + '/methods/validateMethod', {
        joi: {
            validate: function () {}
        }
    });

    var logger = {
        debug: function () {},
        trace: function () {}
    };

    var promise = validateMethod(logger);

    t.type(promise.then, 'function');
    t.type(promise.catch, 'function');

    t.end();

});

t.test('should call joi.validate', function (t) {

    var logger = {
        debug: function () {},
        trace: function () {}
    };

    var config = {a: 1};

    var method = 'GET';

    var raw = {
        path: '',
        methods: {
            GET: {},
            POST: {}
        }
    };

    var validateMethod = proxyquire(root + '/methods/validateMethod', {
        joi: {
            validate: function (value /*, schema, options, callback */) {
                t.same(value, raw);
                t.end();
            }
        }
    });

    validateMethod(logger, config, method, raw);

});

t.test('should resolve promise with valid data, if rawMethod valid', function (t) {

    var validateMethod = proxyquire(root + '/methods/validateMethod', {
        joi: {
            validate: function (value, schema, options, callback) {
                callback(null, {a: 1});
            }
        }
    });

    var logger = {
        debug: function () {},
        trace: function () {}
    };

    validateMethod(logger)
            .then(function (valid) {
                t.same(valid, {a: 1});
                t.end();
            })
            .catch(t.threw);
});


t.test('should reject HttpError code = INVALID_METHOD_OBJECT, if validation fails', function (t) {

    var validateMethod = proxyquire(root + '/methods/validateMethod', {
        joi: {
            validate: function (value, schema, options, callback) {
                callback(new Error('validation fails'));
            }
        }
    });

    var logger = {
        debug: function () {},
        trace: function () {}
    };

    validateMethod(logger)
            .then(function () {
                t.threw(new Error('should reject'));
            })
            .catch(function (error) {
                t.ok(error instanceof HttpError);
                t.equal(error.code, HttpError.CODES.INVALID_METHOD_OBJECT);
                t.end();
            });

});
