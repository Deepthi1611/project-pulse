//importing express module
const exp=require("express")
//creating express mini application
const userApp=exp.Router()

//body parser
userApp.use(exp.json())

//importing from controllers
let {register,login,assignRole}=require("../controllers/users.controller");

//register a user
userApp.post('/register',register);

//user login
userApp.post("/login",login);

//exporting userApp
module.exports=userApp