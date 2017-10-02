# maf-http

http handling powered with express and joi

![stability-unstable](https://img.shields.io/badge/stability-unstable-yellow.svg)

## usage

```js
const Http = require('maf-http');
const express = require('express');

const app = express();

// add your middlewares: body-parser, cookie-parser, etc

// then create maf-http instance and init http methods with request validation

const http = new Http(logger, config);

// init di with models, apis, etc this object will be in every request object
const di = {};

http.initApp(app, di)
    .then(app => http.initMethods(app, di))
    .catch((error) => {

    })

```

## API

[docs/api](docs/api.md)

# LICENSE

MIT
