module.exports = [
    {
        method: 'GET',
        path: '/hapi/example',
        handler: (req, res) => {
            res({code: 200})
        },
        config: {
            tags: ['api', 'tests'],
            description: '测试hello-hapi'
        }
    }
]