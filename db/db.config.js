//importing sequelize
const {Sequelize}=require("sequelize")

//configuring dotenv
require('dotenv').config()

//import mysql2
const mysql2=require("mysql2")

//creating instance for Sequelize
//creates connection
const sequelize=new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:'localhost',
    dialect:"mysql"
  }
);


//create tables for all models
sequelize.sync();

//export sequelize
module.exports=sequelize