# maf-http 0.x API

<!-- toc -->

- [Http](#http)
- [`constructor ([logger], [config])`](#constructor-logger-config)
  - [config format](#config-format)
- [`addMethod (http, method)`](#addmethod-http-method)
- [`setEndpoint (endpoint)`](#setendpoint-endpoint)
- [`init (app)`](#init-app)

<!-- tocstop -->

## Http

## `constructor ([logger], [config])`

- `logger` - Logger. Optional. logger should have trace and debug methods
- `config` - Object. Optional

### config format

```js
{
    /* not implemented */ strictResourceValidation: false,
    /* not implemented */ strictMethodValidation: false
}
```

## `addMethod (http, method)`

- `http`   - Object.
- `method` - MethodObject

`http` format

```js
{
    method: 'GET', // ...
    path: '/test'  // valid value for [express path](http://expressjs.com/ru/4x/api.html#path-examples)
}
```

alternatively http can be String `GET /test:id`


## `setEndpoint (endpoint)`

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

## `init (app)`

add http routes to express app
