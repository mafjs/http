const joi = require('joi');

const options = {
    convert: true,
    abortEarly: false,
    allowUnknown: false
};

module.exports = function validate(value, schema) {
    return new Promise((resolve, reject) => {
        joi.validate(value, schema, options, (error, valid) => {
            if (error) {
                return reject(error);
            }

            return resolve(valid);
        });
    });
};
