require('source-map-support').install();
require('maf-error/initGlobal');

const logger = require('maf-logger').create('http-example');

logger.level('info');

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

http.responseHelpers.result = function testHelper(next, data) {
    this.ctx.status = 200;

    this.ctx.body = {
        result: data
    };

    next('send');
};

const methods = {
    'GET /test': {
        handler(req, res) {
            req.logger.info('GET /test');
            // console.log(req.di);
            res.result(100500);
        }
    },
    'POST /test': {
        schema: {
            body: joi.object().required().keys({
                id: joi.string().required()
            })
        },
        handler(req, res) {
            req.logger.info({ record: req.body }, 'POST /test');
            res.result(req.body);
        }
    }
};

const di = {};

Promise.resolve()
    .then(() => http.initApp(app, di))
    .then(() => http.addMethods(methods))
    .then(() => http.initMethods(app, di))
    .then(() => {
        app.use(http.createBasicMiddlewareNotFound());
        app.use(http.createBasicMiddlewareSend());
        app.use(http.createBasicMiddlewareError());

        app.listen(3003, () => {
            logger.info('listen on 3003');
        });
    })
    .catch((error) => {
        logger.error(error);
    });
