//import express async handler
const expressAsyncHandler=require("express-async-handler")
//import bcryptjs
const bcryptjs=require("bcryptjs")
//importing jwt
const jwt=require("jsonwebtoken")
//importing users model
let {Users}=require("../db/models/users.model")
//importing Employee model
let {Employee}=require("../db/models/employee.model")
//configure dotenv
require("dotenv").config()

//SMTP SET UP

//import nodemailer
const nodemailer = require('nodemailer');

//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD // app password
  }
})

//Creating otps object
let otps={}

//register a user
exports.register=expressAsyncHandler(async (req,res)=>{
  //check if user exists in employee table
  // console.log(req.body.username)
  let emp=await Employee.findOne({where:{"empName":req.body.username}})
  if(emp==undefined){
    res.status(401).send({message:"Only employees can register"})
  }
  else{
  //check if user already registered
  let user=await Users.findOne({where:{"email":req.body.email}})
  // console.log(user)
  //if user already registered
  if(user!==null){
    res.status(409).send({message:"user already registered"})
  }
  //if user did not register
  else{
    await Users.create(req.body)
    res.status(201).send({message:"User registered"})
  }
}
})

//user login
exports.login=expressAsyncHandler(async (req,res)=>{
  // check if username exists
  let {email,password}=req.body;
  let user=await Users.findOne({where:{"email":email}})
  //verify username
  if(user==null){
    res.status(401).send({message:"Invalid Username"})
  }
  else{
    //verify password
    let result=await bcryptjs.compare(password,user.password)
    if(result==false){
      res.status(401).send({message:"Invalid password"})
    }
    else{
      //if role is not assigned
      if(user.role==null){
        res.status(401).send({message:"Unauthorised access..Contact your super Admin for role assignment"})
      }
      //if role is assigned
      else{
      //create jwt token and send to client
      let signedToken=jwt.sign({role:user.role,email:user.email},process.env.SECRET_KEY||"",{expiresIn:"5h"})
      //remove password
      delete user.dataValues.password
      //send jwt in response
      res.status(200).send({message:"Login successful",token:signedToken,user:user})
    }
    }
  }
})

//forget password
exports.forgetpassword=expressAsyncHandler(async(req,res)=>{
  //generating 6 digit random number as otp to reset password
  let otp=Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  //add OTP to otps object
  otps[req.body.email]=otp
  //draft email
  let mailOptions = {
      from: 'projectpulse@gmail.com',
      to: req.body.email,
      subject: 'OTP to reset password',
      text: `Hello ,
       We received a request to reset your password .Enter the following OTP to reset your password :  
        `+otp
    }
  //send email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  //setting valid time to OTP(10 minutes)
  setTimeout(()=>{
      //delete OTP from object after 10 minutes
      delete otps[req.body.email]
  },600000)
  res.status(200).send({message:"OTP to reset your password is sent to your email"})    
})

//reset password
exports.resetPassword=expressAsyncHandler(async(req,res)=>{
  //otp matches
  if(req.body.otp==otps[req.params.email]){
      console.log("password verififed");
      await Users.update({password:req.body.password},{where:{
          email:req.params.email
      }})
      res.status(200).send({message:"Password reset sucessfully"})
  }
  else{
      res.status(401).send({message:"Invalid OTP"})
  }
})

//get all gdo heads and project managers
exports.getManagers=expressAsyncHandler(async(req,res)=>{
  //get all gdo heads
  let gdos=await Users.findAll({where:{role:"GDO head"}})
  //get all project managers
  let projectManagers=await Users.findAll({where:{role:"project manager"}})
  //send response
  res.status(200).send({message:"managers",payload:{gdos,projectManagers}})
})