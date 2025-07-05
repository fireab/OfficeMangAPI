"use strict";

const { off } = require("process");
const { UUIDV4 } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
const compliment = [

  {
    id:1,
    fullName:"naol Getachew",
    city:"Addis Ababa",
    subCity:"Yeka",
    woreda: "nfdg",
    homeNo: "2314",
    phoneNumber: "09406346",
    reason: "pay",
    complimentDate:  "12/10/2014",
    placeSubCity: "subCity", 
    placeWoreda: "woreda",
    employerName :"Abebe Tolcha",
    expectedResponse:"this is the response",
    year: 2024,
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
    await queryInterface.bulkInsert("compilments", compliment);
    },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete("compilments", compliment, {});
  },
};
