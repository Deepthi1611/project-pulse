//import express async handler
const expressAsyncHandler=require("express-async-handler")
//importing sequelize from db.congig.js
const sequelize = require("../db/db.config")
//import bcryptjs
const bcryptjs=require("bcryptjs")
//importing jwt
const jwt=require("jsonwebtoken")
//importing users model
let {Users}=require("../db/models/users.model")

//assigning role to users
exports.assignRole=expressAsyncHandler(async (req,res)=>{
  //check if the user exists
  let user=await Users.findOne({where:{"email":req.body.email}})
  if(user==null){
    res.send({message:"User does not exist"})
  }
  else{
    //check if user already has role
    if(user.role!=undefined){
      res.send({message:"User is already assigned with a role"})
    }
    //if user is not assigned with a role
    else{
    await Users.update({"role":req.body.role},{where:{"email":req.body.email}})
    res.send({message:"Role is assigned for user"})
  }
  }
})