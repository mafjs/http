let t = require('tap');
let proxyquire = require('proxyquire');

let root = '../../../package';

t.test('should return object if value object', function(t) {
    let fn = proxyquire(root + '/methods/validateHttpParam/prepare', {});

    let logger = {
        debug: () => {},
        trace: () => {},
        getLogger: () => this // eslint-disable-line no-invalid-this
    };

    let obj = {
        a: 1
    };

    t.same(fn(logger, obj), obj);
    t.end();
});

t.test('should return httpParam object if value string', function(t) {
    let fn = proxyquire(root + '/methods/validateHttpParam/prepare', {});

    let logger = {
        debug: () => {},
        trace: () => {},
        getLogger: () => this // eslint-disable-line no-invalid-this
    };

    t.same(fn(logger, 'GET /test/:id'), {
        method: 'GET',
        path: '/test/:id'
    });
    t.end();
});


t.test('should split string only by first space', function(t) {
    let fn = proxyquire(root + '/methods/validateHttpParam/prepare', {});

    let logger = {
        debug: () => {},
        trace: () => {},
        getLogger: () => this // eslint-disable-line no-invalid-this
    };

    t.same(fn(logger, 'GET /test /:id'), {
        method: 'GET',
        path: '/test /:id'
    });

    t.same(fn(logger, 'GET /test /   :id'), {
        method: 'GET',
        path: '/test /   :id'
    });

    t.same(fn(logger, 'GET a b c'), {
        method: 'GET',
        path: 'a b c'
    });

    t.end();
});
