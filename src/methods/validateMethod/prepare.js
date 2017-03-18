module.exports = function (logger, raw) {

    if (typeof raw === 'function') {

        logger.debug('rawMethod is function, make object with handler');

        return {
            handler: raw
        };
    }

    return raw;

};
