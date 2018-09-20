const Joi = require('joi')

module.exports = {
    authorizationValidate: {
        headers: Joi.object({
            authorization: Joi.string().required().description('身份验证').error(new Error('该接口需要进行身份验证'))
        }).unknown()
    }
}