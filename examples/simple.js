require('maf-error/initGlobal');

var logger = require('log4js-nested').getLogger();

var joi = require('joi');
var Http = require('../package/Http');

var app = require('express')();

var cookieParser = require('cookie-parser');

app.use(cookieParser());

var bodyParser = require('body-parser');

app.use(bodyParser.json({type: '*/*'}));

var config = {
    responseTimeout: 1000
};

var rest = new Http(logger, config);

rest.setEndpoint('/api/v0');

Promise.resolve()
    .then(() => {

        return rest.addMethods({
            'GET /test/:id': {
                schema: {
                    path: joi.object().keys({
                        id: joi.number()
                    }),
                    query: joi.object().keys({
                        q: joi.number()
                    }),
                    cookies: joi.object().required().keys({
                        test: joi.number()
                    }),
                    headers: joi.object().unknown(true).keys({
                        auth: joi.string().valid(['100500'])
                    })
                },
                handler: function (req, res) {
                    res.json('GET');
                }
            },
            'POST /test/:id': {
                schema: {
                    body: joi.object().required().keys({
                        name: joi.number().required()
                    })
                },
                handler: function (req, res) {
                    res.json(req.body);
                }
            },
            'GET /test': {
                handler: function (req, res) {
                    res.time('test');

                    setTimeout(function () {
                        res.json({
                            text: 'yo!'
                        });
                        res.timeEnd('test');
                    }, 100);

                }
            }
        });

    })
    .then(() => {
        return rest.init(app);
    })
    .then(() => {

        app.use(function (error, req, res, next) {

            error.getCheckChain()
                .ifCode(rest.Error.CODES.INVALID_REQUEST_DATA, (error) => {

                    res.status(400).json({
                        error: {
                            message: 'invalid request data',
                            requestPart: error.requestPart,
                            details: error.details
                        }
                    });

                })
                .else((error) => {

                    logger.error('#########', error);

                    res.status(500).json({
                        error: 'Server Error'
                    });

                })
                .check();

        });

        app.listen(3003);
    })
    .catch((error) => {
        logger.error(error);
    });
