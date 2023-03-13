//import sequelize from database
const sequelize=require("../db.config");
//import datatypes from sequelize
const {DataTypes}=require("sequelize");

//create project updates model
exports.ProjectUpdates=sequelize.define("project_updates",{
  projectId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  projectManager:{
    type:DataTypes.STRING,
    allowNull:false
  },
  date:{
    type:DataTypes.DATE,
    allowNull:false
  },
  statusUpdate:{
    type:DataTypes.STRING,
    allowNull:false
  },
  scheduleStatus:{
    type:DataTypes.STRING,
    allowNull:false
  },
  resourcingStatus:{
    type:DataTypes.STRING,
    allowNull:false
  },
  qualityStatus:{
    type:DataTypes.STRING,
    allowNull:false
  },
  clientInputs:{
    type:DataTypes.BOOLEAN,
    allowNull:false
  }
},{
  timestamps:false,
  freezeTableName:true
})