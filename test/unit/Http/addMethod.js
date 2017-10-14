require('source-map-support').install();

let t = require('tap');
let proxyquire = require('proxyquire');

let root = '../../../package';

// let HttpError = require(root + '/Error');

/**
 * @test {Http#addMethod}
 */
t.test('should call validateHttpParam', function(t) {
    let logger = {
        debug: () => {},
        trace: () => {},
        getLogger: () => this // eslint-disable-line no-invalid-this
    };

    let config = {
        a: 1
    };

    let httpParam = {method: 'GET', path: '/test'};

    let Http = proxyquire(root + '/Http', {
        './methods/validateHttpParam': function(_logger, _config, _httpParam) {
            // t.same(_logger, logger);
            t.same(_config, config);
            t.same(_httpParam, httpParam);
            t.end();
        },
        './methods/validateMethod': function() {
            return new Promise((resolve) => {
                resolve({});
            });
        }
    });

    let rest = new Http(logger, config);

    rest.addMethod(httpParam, {});
});


t.test('should call validateMethod', function(t) {
    let logger = {
        debug: () => {},
        trace: () => {},
        getLogger: () => this // eslint-disable-line no-invalid-this
    };

    let config = {
        a: 1
    };

    let httpMethod = {handler: function() {}};

    let Http = proxyquire(root + '/Http', {
        './methods/validateHttpParam': function() {
            return new Promise((resolve) => {
                resolve({method: 'GET', path: '/test'});
            });
        },
        './methods/validateMethod': function(_logger, _config, _httpParam, _httpMethod) {
            // t.same(_logger, logger);
            t.same(_config, config);
            t.same(_httpParam, {method: 'GET', path: '/test'});
            t.same(_httpMethod, httpMethod);
            t.end();


            return new Promise((resolve, reject) => {
                resolve({});
            });
        }
    });

    let rest = new Http(logger, config);

    rest.addMethod('httpParamStub', httpMethod);
});
