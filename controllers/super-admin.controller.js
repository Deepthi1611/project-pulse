//import express async handler
const expressAsyncHandler=require("express-async-handler")
//importing users model
let {Users}=require("../db/models/users.model")

//get users details
exports.users=expressAsyncHandler(async (req,res)=>{
  let users=await Users.findAll({attributes:{exclude:['password']}})
  res.status(200).send({message:"employees:",payload:users})
})

//assigning role to users
exports.assignRole=expressAsyncHandler(async (req,res)=>{
  //check if the user exists
  let user=await Users.findOne({where:{"email":req.body.email}})
  if(user==null){
    res.status(204).send({message:"User does not exist"})
  }
  else{
    //check if user already has role
    if(user.role!=undefined){
      res.status(409).send({message:"User is already assigned with a role"})
    }
    //if user is not assigned with a role
    else{
    await Users.update({"role":req.body.role},{where:{"email":req.body.email}})
    res.status(200).send({message:"Role is assigned for user"})
  }
  }
})