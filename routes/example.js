const Joi = require('joi')
const GROUP = 'example'
module.exports = [
    {
        method: 'POST',
        path: `/${GROUP}/{orderId}/pay`,
        handler: async (req, res) => {
            res({code: 200})
        },
        config: {
            tags: ['api', GROUP],
            description: '支付订单',
            validate: {
                // url路径参数
                params: {
                    orderId: Joi.string().min(3).required().error(new Error('订单号错误'))
                },
                // 适用于 POST 接口的 payload（request body）验证
                payload: {
                    userId: Joi.string().required().error(new Error('userId不能为空'))
                },
                // 适用于 GET 接口的 query（URL 路径参数）
                query: {}
            }
        }
    },
    {
        method: 'POST',
        path: `/${GROUP}/{orderId}/delete`,
        handler: async (req, res) => {
            res({code: 200})
        },
        config: {
            tags: ['api', GROUP],
            description: '取消订单',
            validate: {
                payload: {
                    users: Joi.array().items(
                        Joi.object().keys({
                            name: Joi.string().required().description('名字'),
                            age: Joi.default(18),
                            more: Joi.object({
                                age: Joi.number().min(18).required()
                            }).unknown()
                        })
                    )
                }
            }
        }
    }
]