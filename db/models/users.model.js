//import sequelize from database
const sequelize=require("../db.config");
//import datatypes from sequelize
const {DataTypes}=require("sequelize");
//import bcryptjs
const bcryptjs=require("bcryptjs")

//create users model
exports.Users=sequelize.define("users",{
  email:{
    type:DataTypes.STRING,
    primaryKey:true,

    validate:{
      checkEmail(email){
        let domain=email.split("@");
        if(domain[1]!=="westagilelabs.com"){
          throw new Error('Mail should be of westagilelabs organisation')
        }
      }
    }
  },
  username:{
    type:DataTypes.STRING,
    allowNull:false
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false,

    set(password){
      let newPassword=bcryptjs.hashSync(password,5)
      this.setDataValue('password',newPassword)
    }
  },
  role:{
    type:DataTypes.STRING,
    defaultValue:null
  }
},{
  timestamps:false,
  freezeTableName:true
})