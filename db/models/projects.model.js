//import sequelize from database
const sequelize=require("../db.config");
//import datatypes from sequelize
const {DataTypes}=require("sequelize");

//create projects model
exports.Projects=sequelize.define("projects",{
  projectId:{
    type:DataTypes.INTEGER,
    primaryKey:true
  },
  projectName:{
    type:DataTypes.STRING,
    allowNull:false
  },
  client:{
    type:DataTypes.STRING,
    allowNull:false
  },
  clientAccountManager:{
    type:DataTypes.STRING,
    allowNull:false
  },
  statusOfProject:{
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
  projectFitnessIndicator:{
    type:DataTypes.STRING,
    allowNull:false
  },
  domain:{
    type:DataTypes.STRING,
    allowNull:false
  },
  typeOfProject:{
    type:DataTypes.STRING,
    allowNull:false
  },
  teamSize:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  GdoHeadEmail:{
    type:DataTypes.STRING,
    allowNull:false
  },
  projectManagerEmail:{
    type:DataTypes.STRING,
    allowNull:false
  },
},{
  timestamps:false,
  freezeTableName:true
})