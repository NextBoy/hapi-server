module.exports = (sequelize, DataType) => sequelize.define('articles',{
    id: {
        type: DataType.TINYINT, // int类型
        primaryKey: true, // 主键
        allowNull: false, // 非空
        autoIncrement: true // 自增
    },
    author: DataType.STRING,
    article: DataType.TEXT,
    readNum: DataType.TINYINT,
    createAt: DataType.DATE,
    updateAt: DataType.DATE
}, {
    timestamps: false  //去除createAt updateAt
})