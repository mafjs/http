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

t.test('should call prepare method internally', function (t) {

    var validateMethod = proxyquire(root + '/methods/validateMethod', {
        joi: {
            validate: function (value, schema, options, callback) {
                callback(null, {a: 1});
            }
        },
        prepare: function (/*logger, rawMethod*/) {
            t.end();
        }
    });

    var logger = {
        debug: function () {},
        trace: function () {}
    };

    return validateMethod(logger);

});


t.test('prepare method', function (t) {

    t.test('should return object if raw is object', function (t) {
        var logger = {};

        var raw = {handler: 'this_is_function'};

        var prepare = proxyquire(root + '/methods/validateMethod/prepare', {});

        t.same(prepare(logger, raw), {handler: 'this_is_function'});

        t.end();
    });

    t.test('should return object if raw is function', function (t) {
        var logger = {
            debug: function () {}
        };

        var raw = function () {};

        var prepare = proxyquire(root + '/methods/validateMethod/prepare', {});

        var result = prepare(logger, raw);

        t.equal(Object.keys(result).length, 1);

        t.type(result.handler, 'function');

        t.end();
    });

    t.end();


});
