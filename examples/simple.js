require('source-map-support').install();
require('maf-error/initGlobal');

const logger = require('maf-logger').create('http-example');

logger.level('trace');
logger.level('info');

const joi = require('joi');
const Http = require('../src/Http');

const app = require('express')();

const cookieParser = require('cookie-parser');

app.use(cookieParser());

const bodyParser = require('body-parser');

app.use(bodyParser.json({type: '*/*'}));

// app.use(require('express-status-monitor')());

app.get('/test', (req, res) => {
    res.json({result: 100500});
});

const config = {
    responseTimeout: 1000
};

const http = new Http(logger, config);

http.setEndpoint('/api');

http.responseHelpers.result = function testHelper(res, next, data) {
    res.ctx.status = 200;

    // this.ctx.headers['test'] = '100500';

    res.ctx.body = {
        result: data
    };

    next('send');
};

http.responseHelpers.test = function testHelper1(res, next, data) {
    res.ctx.status = 200;
    res.ctx.body = {
        test: data
    };
    next('send');
};

const methods = {
    'GET /test': {
        handler(req, res) {
            res.test(1);
        }
    },
    'GET /test/:id': {
        onCreate: (method, di) => {
            method.schema.query = joi.object().required().keys({
                id: joi.string().required()
            });
        },

        beforeInit: function(req, res, next) {
            req.logger.info('beforeInit');
            next();
        },

        inited: function(req, res, next) {
            req.logger.info('inited');
            next();
        },

        validated: function(req, res, next) {
            req.logger.info('validated');
            next();
        },

        handler(req, res) {
            req.logger.info('GET /test');
            res.result(req.query.id);
        }
    },
    'POST /test': {
        schema: {
            body: joi.object().required().keys({
                id: joi.string().required()
            })
        },
        handler(req, res) {
            req.logger.info({record: req.body}, 'POST /test');
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
