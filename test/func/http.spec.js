const tap = require('tap');
const request = require('supertest');

const httpService = require(`${__dirname}/http-service`);

const createService = () => httpService();

tap.test('should create service', (t) => {
    createService();
    t.done();
});

tap.test('should 200 GET /api/test/:id', (t) => {
    return createService()
        .then((app) => {
            return request(app)
            .get('/api/test/100500')
            .query({id: 'test'})
            .expect(200)
            .then((res) => {
                t.type(res.headers['x-request-id'], 'string');
                t.same(res.headers['x-test'], 'test-header-100500');
                t.same(res.body, {result: [
                    'beforeInit',
                    'inited',
                    'validated',
                    'handler'
                ]});
                t.done();
        });
    });
});

tap.test('should 400 GET /api/test/:id', (t) => {
    return createService()
        .then((app) => {
            return request(app)
            .get('/api/test/100500')
            .expect(400)
            .then((res) => {
                t.type(res.headers['x-request-id'], 'string');
                // t.same(res.headers['x-test'], 'test-header-100500');
                t.same(res.body, {error: {
                    details: [
                        {
                            context: {
                                key: 'id',
                                label: 'id'
                            },
                            message: '"id" is required',
                            path: [
                                'id'
                            ],
                            type: 'any.required'
                        }
                    ],
                    message: 'invalid request data'
                }});
                t.done();
        });
    });
});

tap.test('should notFound', (t) => {
    return createService()
        .then((app) => {
            return request(app)
            .get('/api/test')
            // .query({id: 'test'})
            .expect(404)
            .then((res) => {
                t.type(res.headers['x-request-id'], 'string');
                // t.same(res.headers['x-test'], 'test-header-100500');
                t.same(res.body, {error: {
                    message: 'resource not found',
                    code: 'RESOURCE_NOT_FOUND'
                }});
                t.done();
        });
    });
});

tap.test('should POST /test', (t) => {
    return createService()
        .then((app) => {
            return request(app)
                .post('/api/test')
                .send({id: 'test', group: 'test'})
                .expect(201)
                .then((res) => {
                    t.type(res.headers['x-request-id'], 'string');
                    t.same(res.headers['x-test'], 'test-header-100500');
                    t.same(res.body, {result: {
                        id: 'test',
                        group: 'test'
                    }});
                    t.done();
        });
    });
});
