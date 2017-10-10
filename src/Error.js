/**
 * @type {HttpError}
 */
module.exports = require('maf-error').create('HttpError', {
    INVALID_HTTP_PARAM_OBJECT: 'invalid http param object',
    INVALID_RESOURCE_OBJECT: 'invalid resource object',
    INVALID_METHOD_OBJECT: 'invalid resource method object for %method% %path%',
    INVALID_ARGS: `invalid method arguments:
        method = "%method%"
        argument = "%param%" should be %validType%
        got type = "%type%"
        value = %value%`,
    INVALID_REQUEST_DATA: 'invalid request data',
    RESPONSE_TIMEOUT: 'response timeout: %delay%ms',
});
