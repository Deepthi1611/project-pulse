//middleware to verify the token

//import jsonweb token
const jwt=require("jsonwebtoken")
//import dotenv
const dotenv=require("dotenv")
//configure dotenv-makes process.env available
dotenv.config();


//verifying received token
const verifyToken=(req,res,next)=>{
  //get bearer token from req.headers
  let bearerToken=req.headers.authorization;
  // console.log(bearerToken)
  //check bearer token existence
  if(bearerToken===undefined){
    res.status(401).send({message:"unauthorised access"})
  }
  //if bearer token is existed, get token from bearer token
  else{
    let token=bearerToken.split(" ")[1]//['bearer',token]
    try{
    //decode the token
    //if token is invalid we get error otherwise token is valid
    let role=jwt.verify(token,process.env.SECRET_KEY||"");
    console.log(role)
    if(role.role=="project manager"){
      next()
    }
    else{
      res.status(401).send({message:"Unauthorised access..Only project manager can access"})
    }
  }catch(err){
    res.status(401).send({message:"please login to continue"})
  }
  }
}

//export middle ware
module.exports=verifyToken