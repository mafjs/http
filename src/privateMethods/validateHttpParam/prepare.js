module.exports = function prepareHttpParam(logger, raw) {
    let obj = raw;

    if (typeof raw === 'string') {
        const firstSpacePosition = raw.indexOf(' ');

        obj = {
            method: raw.substring(0, raw.indexOf(' ')),
            path: raw.substring(firstSpacePosition + 1),
        };

        logger.trace({record: {raw, obj}}, 'parse http param string');
    }

    return obj;
};
