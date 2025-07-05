'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
    */
    await queryInterface.bulkInsert('users', [{
      username: 'superadmin',
      password:"test",
      isSuperAdmin:true,
      created_date:new Date(),
      updated_date:new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
