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
  concernDesc:{
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
  concernRaisedInternally:{
    type:DataTypes.BOOLEAN,
    allowNull:false
  },
  status:{
    type:DataTypes.STRING,
    allowNull:false
  },
  mitigatedOn:{
    type:DataTypes.DATE,
    allowNull:false
  }
},{
  timestamps:false,
  freezeTableName:true
})