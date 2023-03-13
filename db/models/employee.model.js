// import sequelize from db.configfrom sequelize
const sequelize = require("../db.config");
//import datatypes
const { DataTypes } = require("sequelize");

//create Employee model
exports.Employee = sequelize.define(
  "employees",
  {
    empId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    empName: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
