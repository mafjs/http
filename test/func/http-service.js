require('source-map-support').install();
require('maf-error/initGlobal');

module.exports = () => {
    const logger = require('maf-logger').create('http-example');

    logger.level('info');

    const joi = require('joi');
    const Http = require(`${__dirname}/../../src/Http`);

    const app = require('express')();

    const cookieParser = require('cookie-parser');

    app.use(cookieParser());

    const bodyParser = require('body-parser');

    app.use(bodyParser.json({type: '*/*'}));

    const config = {
        responseTimeout: 1000
    };

    const http = new Http(logger, config);

    http.setEndpoint('/api');

    http.responseHelpers.sendCtx = function testHelper(next) {
        this.ctx.headers['x-test'] = 'test-header-100500';
        next('send');
    };

    http.globalMiddlewares = {
        beforeInit: [
            (req, res, next) => {
                res._globalBeforeInit = true;
                next();
            }
        ],
        inited: [
            (req, res, next) => {
                res._globalInited = true;
                next();
            }
        ],
        validated: [
            (req, res, next) => {
                res._globalValidated = true;
                next();
            }
        ]
    };

    const methods = {
        'GET /test/:id': {
            onCreate: (method, di) => {
                method.schema.query = joi.object().required().keys({
                    id: joi.string().required()
                });
            },

            beforeInit: function(req, res, next) {
                res._beforeInitCalled = true;
                req.logger.trace('beforeInit');
                next();
            },

            inited: function(req, res, next) {
                res.ctx.body = {
                    routeName: req.ctx.routeName,
                    result: []
                };

                if (res._globalBeforeInit === true) {
                    res.ctx.body.result.push('globalBeforeInit');
                }

                if (res._beforeInitCalled === true) {
                    res.ctx.body.result.push('beforeInit');
                }

                if (res._globalInited === true) {
                    res.ctx.body.result.push('globalInited');
                }

                res.ctx.body.result.push('inited');
                req.logger.trace('inited');
                next();
            },

            validated: function(req, res, next) {
                if (res._globalValidated === true) {
                    res.ctx.body.result.push('globalValidated');
                }

                res.ctx.body.result.push('validated');
                req.logger.trace('validated');
                next();
            },

            handler(req, res) {
                res.ctx.status = 200;
                res.ctx.body.result.push('handler');
                req.logger.trace('GET /test');
                res.sendCtx();
            }
        },
        'POST /test': {
            schema: {
                body: joi.object().required().keys({
                    id: joi.string().required(),
                    group: joi.string().required()
                })
            },
            handler(req, res) {
                req.logger.trace({record: req.body}, 'POST /test');
                res.ctx.status = 201;
                res.ctx.body = {
                    result: req.body
                };
                res.sendCtx();
            }
        }
    };

    const di = {};

    return Promise.resolve()
        .then(() => http.initApp(app, di))
        .then(() => http.addMethods(methods))
        .then(() => http.initMethods(app, di))
        .then(() => {
            app.use(http.createBasicMiddlewareNotFound());
            app.use(http.createBasicMiddlewareSend());
            app.use(http.createBasicMiddlewareError());

            return app;
        });
};
