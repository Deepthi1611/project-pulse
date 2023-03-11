//importing express module
const exp=require("express")
//creating express mini application
const superAdminApp=exp.Router()
//importing middleware
const verifyToken = require("../middlewares/super-admin.middleware");

//body parser
superAdminApp.use(exp.json())

//importing from controllers
let {assignRole}=require("../controllers/super-admin.controller");

//assigning role to  an user
superAdminApp.put("/user/role",verifyToken,assignRole);

//exporting superAminApp
module.exports=superAdminApp