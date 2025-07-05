"use strict";

const { off } = require("process");
const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
const compliment = [

  {
  CustomerService:"Excellent",
  StandardService:"VeryGood",
  FairService:"Good",
  ResponseForCompliment:"Bad",
  ServiceRate:"Intermediate",
  EmployeeId: "1",
  year: 2024,
  name: "desyilal",
  phone: "test",
  created_date:new Date(),
  updated_date:new Date()
}
  // Add the rest of the employee data here...
];
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert("rates", compliment);
    },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete("rates", compliment, {});
  },
};
