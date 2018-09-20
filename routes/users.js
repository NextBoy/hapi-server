const JWT = require('jsonwebtoken')
const Joi = require('joi')
const { generateAuthInfo } = require('../utils/jwt-helper')
const GROUP = 'users'
const config = require('../config')
const { users } = require('../mock.json')
module.exports = [
    // 用户登录
    {
        method: 'POST',
        path: `/${GROUP}/login`,
        handler: async (req, res) => {
            const { userId, password } = req.payload
            const isUser = users.some(user => user.userId == userId && user.password === password)
            if (!isUser) {
                res({
                    statusCode: 200,
                    status: false,
                    msg: '账号或者密码错误',
                    userId,
                    password
                })
            } else {
                const result = generateAuthInfo({userId}, 60, 60 * 3)
                res({
                    statusCode: 200,
                    status: true,
                    info: result
                })
            }
        },
        config: {
            tags: ['api', GROUP],
            description: '用户登录',
            auth: false,
            validate: {
                payload: {
                    userId: Joi.string().required().description('用户账号'),
                    password: Joi.string().required().description('用户密码')
                }
            }
        }
    },
    // 更新token
    {
        method: 'POST',
        path: `/${GROUP}/updateToken`,
        handler: async (req, res) => {
            const { token, exp } = JWT.decode(req.payload.refreshToken, config.jwtSecret)
            if (!token || !exp) {
                res({
                    status: false,
                    statusCode: 200,
                    msg: 'refreshToken不合法'
                })
                return 0
            }
            const effect = exp > Math.floor(Date.now() / 1000)
            if (effect) {
                const { userId } = JWT.decode(token, config.jwtSecret)
                const result = generateAuthInfo({ userId }, 60, 60 * 3)
                res({
                    statusCode: 200,
                    status: true,
                    info: result
                })
            } else {
                res({
                    status: false,
                    statusCode: 200,
                    msg: 'refreshToken已经失效'
                })
            }
        },
        config: {
            tags: ['api', GROUP],
            description: '更新token',
            auth: false,
            validate: {
                payload: Joi.object({
                    refreshToken: Joi.string().required()
                }).unknown()
            }
        }
    }
]