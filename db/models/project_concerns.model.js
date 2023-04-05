//import sequelize from database
const sequelize=require("../db.config");
//import datatypes from sequelize
const {DataTypes}=require("sequelize");

//create project concerns model
exports.ProjectConcerns=sequelize.define("project_concerns",{
  projectId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  concernDescription:{
    type:DataTypes.STRING,
    allowNull:false
  },
  raisedBy:{
    type:DataTypes.STRING,
    allowNull:false
  },
  raisedOnDate:{
    type:DataTypes.DATE,
    allowNull:false
  },
  severity:{
    type:DataTypes.STRING,
    allowNull:false
  },
  concernRaisedInternallyOrNot:{
    type:DataTypes.BOOLEAN,
    allowNull:false
  },
  status:{
    type:DataTypes.STRING,
    allowNull:false
  },
  mitigatedOn:{
    type:DataTypes.DATE
  }
},{
  timestamps:false,
  freezeTableName:true
})