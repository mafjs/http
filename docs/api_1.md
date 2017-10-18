# maf-http 1.x API

draft api for version 1.x

TODO full customization for middlewares

all middleware creation should be a init function return middleware function

```js
{
    schema: {},

    onCreate(method, di) {},

    // global middlewares set for all routes
    globalBeforeInit: [], // or func

    beforeInit: [], // or func

    // init stage as array or Object
    //
    // variants
    //
    //  1
    // init: [],
    //
    // 2
    // init: {
    //     req: [], // or function
    //     res: [], // or function
    // },
    //
    // 3
    // initReq() {},
    // initRes() {},

    globalInited: [], // or func
    inited: [], // or function

    // validation
    validatePath() {},
    validateQuery() {},
    validateCookies() {},
    validateHeaders() {},
    validateBody() {},

    globalValidated: [], // or func
    validated: [], // or func

    handler() {},

    globalNotFound() {},
    globalSend() {},
    globalError() {}
}
```
