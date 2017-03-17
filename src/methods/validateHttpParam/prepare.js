module.exports = function (logger, raw) {

    var obj = raw;

    if (typeof raw === 'string') {

        var firstSpacePosition = raw.indexOf(' ');

        obj = {
            method: raw.substring(0, raw.indexOf(' ')),
            path: raw.substring(firstSpacePosition + 1)
        };

        logger.debug('parse http param string', raw, obj);

    }

    return obj;

};
