//import sequelize from database
const sequelize=require("../db.config");
//import datatypes from sequelize
const {DataTypes}=require("sequelize");

//creating resourcing request model
exports.ResourcingRequest=sequelize.define("resourcing_request",{
  requestDesc:{
    type:DataTypes.STRING,
    allowNull:false
  },
  GdoEmail:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  projectId:{
    type:DataTypes.INTEGER,
    allowNull:false
  }
},{
  timestamps:false,
  freezeTableName:true
})