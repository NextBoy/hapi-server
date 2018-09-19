'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('articles', [
          {
          createAt: new Date(),
          updateAt: new Date(),
          article: '床前明月光' + Math.random(),
          author: 'ZHUO',
          readNum: 100
          },
          {
              createAt: new Date(),
              updateAt: new Date(),
              article: '床前明月光' + Math.random(),
              author: 'ZHUO',
              readNum: 100
          },
          {
              createAt: new Date(),
              updateAt: new Date(),
              article: '床前明月光' + Math.random(),
              author: 'ZHUO',
              readNum: 100
          },
          {
              createAt: new Date(),
              updateAt: new Date(),
              article: '床前明月光' + Math.random(),
              author: 'ZHUO',
              readNum: 100
          },
          {
              createAt: new Date(),
              updateAt: new Date(),
              article: '床前明月光' + Math.random(),
              author: 'ZHUO',
              readNum: 100
          },
          {
              createAt: new Date(),
              updateAt: new Date(),
              article: '床前明月光' + Math.random(),
              author: 'ZHUO',
              readNum: 100
          },
          {
              createAt: new Date(),
              updateAt: new Date(),
              article: '床前明月光' + Math.random(),
              author: 'ZHUO',
              readNum: 100
          }
          ], { charset: 'utf8'});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
