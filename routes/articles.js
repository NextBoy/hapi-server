const Joi = require('joi')
const GROUP = 'articles'
const models = require('../models')
const { authorizationValidate } = require('../utils/routes-helper')
module.exports = [
    {
        method: 'POST',
        path: `/${GROUP}/list`,
        handler: async (req, res) => {
            try {
                // const result = await models.articles.findAll({attributes: {exclude: ['readNum']}})
                // const count = await models.articles.count()
                const info = await models.articles.findAndCountAll ({
                    offset: req.payload.pageSize * (req.payload.pageNum - 1),
                    limit: req.payload.pageSize})
                res(info)
            } catch (err){
                console.error(err)
            }
        },
        config: {
            tags: ['api', GROUP],
            description: '获取订单列表',
            auth: false,
            validate: {
                payload: Joi.object({
                    pageSize: Joi.number().default(10).description('分页大小').error(new Error('分页大小必须为数字')),
                    pageNum: Joi.number().default(1).description('分页数量').error(new Error('分页数量必须大于等于1'))
                }).unknown()
            }
        }
    },
    {
        method: 'GET',
        path: `/${GROUP}/{articleId}`,
        handler: async (req, res) => {
            console.log(req)
            try {
                console.log(req.auth.credentials)
                const result = await models.articles.find({
                    where: {
                        id: req.params.articleId
                    }
                })
                res(result)
            }catch (err) {
                console.error(err)
            }
        },
        config: {
            tags: ['api', GROUP],
            description: '根据ID获取文章详情',
            validate: {
                params: {
                    articleId: Joi.string().required().description('文章Id').error(new Error('文章ID不能为空'))
                },
                ...authorizationValidate
            }
        }
    }
]