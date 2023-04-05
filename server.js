//importing express object
const exp=require("express")

//import cors
const cors = require('cors');

//creating express application
const app=exp()

//using cors
app.use(cors());

//configure dotenv
require("dotenv").config()

//import helmet
const helmet=require("helmet")

//helmet middleware - application level
// app.use(helmet())

//import sequelize from db.config.js
const sequelize=require("./db/db.config")

//test the DB connection
sequelize.authenticate()
.then(()=>console.log("DB connection successful"))
.catch((err)=>console.log("error",err))

//importing Apps
const userApp=require("./routes/users.route");
const superAdminApp=require("./routes/super-admin.route")
const adminApp=require("./routes/admin.route")
const gdoHeadApp = require("./routes/gdoHead.route")
const projectManagerApp=require("./routes/project-manager.route")

//middlewares for route
app.use("/user-api",userApp)
app.use("/super-admin-api",superAdminApp)
app.use("/admin-api",adminApp)
app.use("/gdoHead-api",gdoHeadApp)
app.use("/project-manager-api",projectManagerApp)


//invalid path middleware
app.use("*",(req,res,next)=>{
  res.status(400).send({message:"Invalid path"})
})

//default error handling middleware
app.use((err,req,res,next)=>{
  res.status(400).send({"error":err.message})
})

//exporting app
module.exports=app