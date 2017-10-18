# maf-http 0.x API


## method format

```js
{
    'GET /todos': {
        schema: {
            path: joi.object(),
            query: joi.object(),
            headers: joi.object(),
            cookies: joi.object(),
            body: joi.object()
        },

        // your can modify schema
        // before express method created
        onCreate(method, di) {},

        // before any other middlewares for this method
        // Function or Function[]
        beforeInit: [
            (req, res, next) => {}
        ],

        init: [

        ],

        // add init middlewares
        // TODO init requestId
        // - req.ctx.id
        // - req.ctx.logger
        // - req.ctx.routeName = null
        // - req.id
        // - req.logger
        // - process req.query._trace, req.query._debug
        // internal add middlewares
        // initStartTime
        // - init req.startTime = new Date();
        // initResponseTimeout
        // - init response timeout res.timeout
        // initReq
        // - init req.ctx.routeName
        // - init request helpers (hasQueryParam ...)
        // initReqDi
        // - req.di = di
        // initRes
        // - init response helpers
        // - reassign res.send
        // initResCtx
        // - init res.ctx

        // after init middlewares
        // Function or Function[]
        inited: [
            (req, res, next) => {}
        ],

        // add validation middlewares by schema
        // initPathValidation
        // initQueryValidation
        // initCookiesValidation
        // initHeadersValidation
        // initBodyValidation

        // after validation middlewares
        // Function or Function[]
        validated: [
            (req, res, next) => {}
        ],

        handler(req, res, next) {},

        // no, set your own global send middleware
        // Function or Function[]
        // handled: [
        //     (req, res, next) => {}
        // ]
    }
}

// global middlewares
{
    // not found middleware
    notFound(req, res, next) {
        // send 404
    },

    // send middleware
    send(error, req, res, next) => {
        if (error === 'send') {
            // send res.ctx
        }
        next();
    },

    error(error, req, res, next) {
        // log error
        // send 500
    }

}
```
