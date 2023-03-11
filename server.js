//importing express object
const exp=require("express")

//creating express application
const app=exp()

//configure dotenv
require("dotenv").config()

//creating port number
const PORT=process.env.PORT||4000

//assigning port number
app.listen(PORT,()=>{
  console.log(`server started at ${PORT}`)
})

//import sequelize from db.config.js
const sequelize=require("./db/db.config")

//test the DB connection
sequelize.authenticate()
.then(()=>console.log("DB connection successful"))
.catch((err)=>console.log("error",err))

//importing testApp
const userApp=require("./routes/users.route");
const superAdminApp=require("./routes/super-admin.route")

//middlewares for route
app.use("/user-api",userApp)
app.use("/super-admin-api",superAdminApp)

//invalid path middleware
app.use("*",(req,res,next)=>{
  res.send({message:"Invalid path"})
})

//default error handling middleware
app.use((err,req,res,next)=>{
  res.send({"error":err.message})
})