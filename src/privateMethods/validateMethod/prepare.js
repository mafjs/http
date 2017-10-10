module.exports = function prepareMethod(logger, raw) {
    if (typeof raw === 'function') {
        logger.trace('rawMethod is function, make object with handler');

        return {
            handler: raw,
        };
    }

    return raw;
};
