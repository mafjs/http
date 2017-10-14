module.exports = function validateConfig(config) {
    // TODO check config
    if (!config) {
        return {
            strictResourceValidation: false,
            strictMethodValidation: false,
            responseTimeout: 1 * 60 * 1000 // 1 minutes
        };
    }

    return config;
};
