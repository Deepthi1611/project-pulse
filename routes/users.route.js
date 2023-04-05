//importing express module
const exp=require("express")
//creating express mini application
const userApp=exp.Router()

//body parser
userApp.use(exp.json())


//importing from controllers
let {register,login,forgetpassword,resetPassword,getManagers}=require("../controllers/users.controller");

//register a user
userApp.post('/register',register);

//user login
userApp.post("/login",login);

//forget password
userApp.post("/forget-password",forgetpassword)

//reset password
userApp.put("/reset-password/email/:email",resetPassword)

//get managers
userApp.get("/managers",getManagers)

//exporting userApp
module.exports=userApp