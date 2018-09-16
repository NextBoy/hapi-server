require('env2')('./env/.env.dev')
const Hapi = require('hapi')
const connectionConfig = require('./config')
const exampleRoute = require('./routes/example')
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
        ...exampleRoute
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