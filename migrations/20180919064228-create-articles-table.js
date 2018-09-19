'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('articles', {
      id: {
        type: Sequelize.TINYINT, // int类型
        primaryKey: true, // 主键
        allowNull: false, // 非空
        autoIncrement: true // 自增
      },
      author: Sequelize.STRING,
      articles: Sequelize.TEXT,
      createAt: Sequelize.DATE,
      updateAt: Sequelize.DATE
    },
    { charset: 'utf8' })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('articles')
  }
};
