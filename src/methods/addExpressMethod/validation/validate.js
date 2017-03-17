var joi = require('joi');

var options = {
    convert: true,
    abortEarly: false,
    allowUnknown: false
};

module.exports = function (value, schema) {

    return new Promise((resolve, reject) => {

        joi.validate(value, schema, options, function (error, valid) {
            if (error) {
                return reject(error);
            }

            resolve(valid);
        });
    });

};
