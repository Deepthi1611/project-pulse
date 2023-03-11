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


//register a user
exports.register=expressAsyncHandler(async (req,res)=>{
  //check if user already registered
  let user=await Users.findOne({where:{"email":req.body.email}})
  // console.log(user)
  //if user already registered
  if(user!==null){
    res.send({message:"user already registered"})
  }
  //if user did not register
  else{
    let {password}=req.body
    let newPassword=await bcryptjs.hash(password,5)
    req.body.password=newPassword
    // console.log(req.body)
    await Users.create(req.body)
    res.send({message:"User registered"})
  }
})

//user login
exports.login=expressAsyncHandler(async (req,res)=>{
  // check if username exists
  let {email,password}=req.body;
  let user=await Users.findOne({where:{"email":email}})
  console.log(user)
  if(user==null){
    res.send({message:"Invalid Username"})
  }
  else{
    //verify password
    let result=await bcryptjs.compare(password,user.password)
    if(result==false){
      res.send({message:"Invalid password"})
    }
    else{
      //if role is not assigned
      if(user.role==null){
        res.send({message:"Unauthorised access..Contact your super Admin for role assignment"})
      }
      //if role is assigned
      else{
      //create jwt token and send to client
      let signedToken=jwt.sign({role:user.role},process.env.SECRET_KEY||"",{expiresIn:"5h"})
      //remove password
      delete user.password
      //send jwt in response
      res.status(200).send({message:"Login successful",token:signedToken,user:user})
    }
    }
  }
})
