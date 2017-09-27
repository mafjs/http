require('source-map-support').install();
require('maf-error/initGlobal');

const logger = require('maf-logger').create('http-example');

logger.level('trace');

const joi = require('joi');
const Http = require('../src/Http');

const app = require('express')();

const cookieParser = require('cookie-parser');

app.use(cookieParser());

const bodyParser = require('body-parser');

app.use(bodyParser.json({ type: '*/*' }));

const config = {
    responseTimeout: 1000
};

const http = new Http(logger, config);

http.setEndpoint('/api/v0');

http.responseHelpers.test = function testHelper() {
    this.ctx.body = {};
};

const methods = {
    'POST /test/count': {
        schema: {
            body: joi.object()
        },
        handler(req, res) {
            res.test();
            // console.log(req.hasPathParam('test'));
            // res.json({result: 100500});
        }
    },
    'GET /test/:id': {
        schema: {
            path: joi.object().keys({
                id: joi.number()
            }),
            cookies: joi.object().required().unknown(true).keys({
                test: joi.number()
            }),
            headers: joi.object().unknown(true).keys({
                auth: joi.string().valid(['100500'])
            })
        },
        beforeMethodCreation(method, di) {
            // eslint-disable-next-line no-param-reassign
            method.schema.query = di.testSchema;
        },
        handler(req, res) {
            res.json('GET');
        }
    }
    // 'POST /test/:id': {
    //     schema: {
    //         body: joi.object().required().keys({
    //             name: joi.number().required()
    //         })
    //     },
    //     handler(req, res) {
    //         res.json(req.body);
    //     }
    // },
    // 'GET /test': {
    //     handler(req, res) {
    //         res.time('test');
    //
    //         setTimeout(() => {
    //             res.timeEnd('test');
    //
    //             res.test({
    //                 text: 'yo!'
    //             });
    //         }, 100);
    //     }
    // }
};

const di = {};

Promise.resolve()
    .then(() => http.addMethods(methods))
    .then(() => http.init(app, di))
    .then(() => {
    // eslint-disable-next-line no-unused-vars
        app.use((req, res) => {
            if (!res.httpContext) {
                req.logger.trace('send 404 RESOURCE_NOT_FOUND');

                return res.status(404).json({
                    error: {
                        message: 'resource not found',
                        code: 'RESOURCE_NOT_FOUND'
                    }
                });
            }

            res.requestEnd();

            logger.info(res.httpContext);

            const context = res.httpContext;

            // context.body.debug = {
            //     requestId: req.id,
            //     time: context.time
            // };

            return res.send(context.body);
        });

        // eslint-disable-next-line no-unused-vars
        app.use((error, req, res, next) => {
            error
                .getCheckChain()
                .ifCode(http.Error.CODES.INVALID_REQUEST_DATA, (err) => {
                    res.status(400).json({
                        error: {
                            message: 'invalid request data',
                            requestPart: err.requestPart,
                            details: err.details
                        }
                    });
                })
                .else((err) => {
                    logger.error({ req, err });

                    res.status(500).json({
                        error: 'Server Error'
                    });
                })
                .check();
        });

        app.listen(3003, () => {
            logger.info('listen on 3003');
        });
    })
    .catch((error) => {
        logger.error(error);
    });
