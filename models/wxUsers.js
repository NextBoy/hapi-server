module.exports = (sequelize, DataTypes) => sequelize.define(
    'wxUsers',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nick_name: DataTypes.STRING,
        avatar_url: DataTypes.STRING,
        gender: DataTypes.INTEGER,
        open_id: DataTypes.STRING,
        session_key: DataTypes.STRING,
    }
)