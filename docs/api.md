# maf-http 0.x API

<!-- toc -->

- [Http](#http)
  - [`constructor ([logger], [config])`](#constructor-logger-config)
  - [`addMethod (http, method)`](#addmethod-http-method)
  - [`setEndpoint (endpoint)`](#setendpoint-endpoint)
  - [`init (app)`](#init-app)
- [MethodObject](#methodobject)
- [HttpError](#httperror)
  - [error codes on method creation](#error-codes-on-method-creation)
  - [runtime error codes](#runtime-error-codes)

<!-- tocstop -->

## Http



### `constructor ([logger], [config])`

- `logger` - Logger. Optional. logger should have trace and debug methods
- `config` - Object. Optional

**config format**

```js
{
    responseTimeout: 1000, // Number, default undefined

    /* not implemented */ strictResourceValidation: false,
    /* not implemented */ strictMethodValidation: false
}
```




### `addMethod (http, method)`

- `http`   - Object.
- `method` - [MethodObject](#methodobject)

`http` format

```js
{
    method: 'GET', // ...
    path: '/test'  // valid value for [express path](http://expressjs.com/ru/4x/api.html#path-examples)
}
```

alternatively http can be String `GET /test:id`

return `Promise`



### `setEndpoint (endpoint)`

add endpoint info

- `endpoint` - Object|String

if endpoint is string - endpoint path will be setted

if endpoint is object

```js
{
    title: 'short api description',
    description: 'markdown description',
    path: '/api/v0'
}
```




### `init (app)`

add http routes to express app

return `Promise`


## MethodObject


```js
{
    title: null,         // short method description
    description: null,   // full method description

    // joi schemas for every part of request
    schema: {
        path: joi.object(),
        query: joi.object(),
        body: joi.object(),
        cookies: joi.object(),
        headers: joi.object()
    },

    // express request handler function
    handler: function (req, res) {

    }
}
```

**example**

```js
rest.addMethod('GET /test', {
    title: null,
    description: null,
    schema: {
        // ...
    },
    handler: function (req, res) {

    }
});
```

you can use short notation for MethodObject - only handler function

```js
rest.addMethod('GET /test', function (req, res) {
    // ...
});
```


## HttpError


### error codes on method creation

- `INVALID_HTTP_PARAM_OBJECT`
- `INVALID_RESOURCE_OBJECT`
- `INVALID_METHOD_OBJECT`
- `INVALID_ARGS`


### runtime error codes

- `INVALID_ARGS`
