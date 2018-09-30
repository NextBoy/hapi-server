const JWT = require('jsonwebtoken')
const Joi = require('joi')
const axios = require('axios')
const { generateAuthInfo } = require('../utils/jwt-helper')
const GROUP = 'users'
const config = require('../config')
const { users } = require('../mock.json')
const models = require('../models')
const WXBizDataCrypt = require('../utils/WXBizDataCrypt')
// 存储code-session_key
let codeStore = {}
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
    },
    // 微信登录
    {
        method: 'POST',
        path: `/${GROUP}/wxLogin`,
        handler: async (req, res) => {
            try {
                const { code } = req.payload
                console.log({code})
                // 通过客户端发送的code去微信服务点获取session_key, openid
                const response = await axios({
                    url: 'https://api.weixin.qq.com/sns/jscode2session',
                    method: 'GET',
                    params: {
                        appid: config.AppID,
                        secret: config.AppSecret,
                        js_code: code,
                        grant_type: 'authorization_code',
                    }
                })
                console.log(response)
                const { session_key, openid } = response.data
                codeStore[code] = { session_key, openid }
                if (!openid) {
                    res({statusCode: 200, status: false, msg: '参数校验错误'})
                    return 0
                }
                // 基于 openid 查找或创建一个用户
               const user = await models.wxUsers.findCreateFind({
                   where: { open_id: openid },
                   defaults: {
                       session_key
                   }
                });
                const isNewUser = user[1]
                if (!isNewUser) {
                    models.wxUsers.update({session_key}, {where: { open_id: openid }})
                }
                let result = generateAuthInfo({userId: user[0].id}, 60, 60 * 3)
                if (result) {
                    result.isNewUser = isNewUser
                }
                res({statusCode: 200, status: true, info: result})
            } catch (err){
                console.log('some err')
                console.error(err)
            }
        },
        config: {
            tags: ['api', GROUP],
            description: '微信登录接口',
            auth: false,
            validate: {
                payload: {
                    code: Joi.string().required().error(new Error('code 不能为空'))
                }
            }
        }
    },
    // 微信信息存储
    {
        method: 'POST',
        path: `/${GROUP}/saveWxUserInfo`,
        handler: async (req, res) => {
            try {
                const { encryptedData, iv } = req.payload
                const userId = req.auth.credentials.userId
                const userInfo = await models.wxUsers.find({where: { id: userId }})
                console.log({userInfo})
                const session_key = userInfo.dataValues.session_key
                const pc = new WXBizDataCrypt(config.AppID, session_key)
                const data = pc.decryptData(encryptedData , iv)
                // 更新 user 表中的用户的资料信息
                await models.wxUsers.update({
                    nick_name: data.nickName,
                    gender: data.gender,
                    avatar_url: data.avatarUrl,
                    open_id: data.openId
                }, {
                    where: { open_id: data.openId },
                })
                res({statusCode: 200, status: true})
            } catch (err){
                console.error(err)
            }
        },
        config: {
            tags: ['api', GROUP],
            description: '微信用户信息存储接口',
            validate: {
                payload: {
                    iv: Joi.string().required().error(new Error('iv 不能为空')),
                    encryptedData: Joi.string().required().error(new Error('encryptedData 不能为空'))
                }
            }
        }
    }
]