//import sequelize from database
const sequelize=require("../db.config");
//import datatypes from sequelize
const {DataTypes}=require("sequelize");

//create team composition model
exports.TeamComposition=sequelize.define("team_composition",{
  projectId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  empId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  empName:{
    type:DataTypes.STRING,
    allowNull:false
  },
  role:{
    type:DataTypes.STRING,
    allowNull:false
  },
  startDate:{
    type:DataTypes.DATE,
    allowNull:false
  },
  endDate:{
    type:DataTypes.DATE,
    allowNull:false
  },
  status:{
    type:DataTypes.STRING,
    allowNull:false
  },
  billingStatus:{
    type:DataTypes.STRING,
    allowNull:false
  },
  exposerdToCustomer:{
    type:DataTypes.BOOLEAN,
    allowNull:false
  },
  allocationType:{
    type:DataTypes.STRING,
    allowNull:false
  }
},{
  timestamps:false,
  freezeTableName:true
})