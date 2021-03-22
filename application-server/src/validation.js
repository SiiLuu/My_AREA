const Joi = require('@hapi/joi');

const registerValidation = data => {
    const shema = {
        username: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required()
    };
    return Joi.validate(data, shema);
};

const loginValidation = data => {
    const shema = {
        email: Joi.string().required().email(),
        password: Joi.string().required()
    };
    return Joi.validate(data, shema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
