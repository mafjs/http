// eslint-disable-next-line no-unused-vars
module.exports = function middlewareBasicError(error, req, res, next) {
    if (error.code === 'INVALID_REQUEST_DATA') {
        res.status(400).json({
            error: {
                message: 'invalid request data',
                requestPart: error.requestPart,
                details: error.details
            }
        });
    } else {
        req.logger.error({ req, err: error });

        res.status(500).json({
            error: 'Server Error'
        });
    }
};
