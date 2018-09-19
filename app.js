if (process.env.NODE_ENV.trim() === 'development') {
    require('env2')('./env/.env.dev')
} else {
    require('env2')('./env/.env.production')
}
const Hapi = require('hapi')
const connectionConfig = require('./config')
// 路由api接口
const exampleRoute = require('./routes/example')
const articlesRoute = require('./routes/articles')
// 引入自定义的 hapi-swagger 插件配置
const pluginHapiSwagger = require('./plugins/hapi-swagger')
const server = new Hapi.Server()

// 配置启动项
server.connection(connectionConfig)

/*hapi最新版本的启动配置项可以直接如下配置*/
// const server = new Hapi.Server({port, host})

const init = async() => {
    await server.register([
        // 为系统使用 hapi-swagger
        ...pluginHapiSwagger
    ])
    server.route([
        // example route
        ...exampleRoute,
        ...articlesRoute
    ])
    // 启动服务
    await server.start()
    console.log(`server is running at ${server.info.uri}`)
    // 捕获异常
    process.on('unhandledRejection', (err) => {
        console.error(err)
        process.exit(1)
    })
}

init()