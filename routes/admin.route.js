//importing express module
const exp=require("express")
//creating express mini application
const adminApp=exp.Router()
//import middleware
const verifyToken=require("../middlewares/admin.middleware")

//body parser
adminApp.use(exp.json())

//import controllers
let {project,getProjects,getSpecificProjectDetails,updateProject,deleteProject,getResourceRequests}=require("../controllers/admin.controller")

//creating a project
adminApp.post("/project",verifyToken,project)

//get all projects
adminApp.get("/projects",verifyToken,getProjects)

//get specific project details
adminApp.get("/projectId/:projectId",verifyToken,getSpecificProjectDetails)

//update project details
adminApp.put("/projectId/:projectId",verifyToken,updateProject)

//delete a project
adminApp.delete("/projectId/:projectId",deleteProject)

//get resourcing request
adminApp.get("/resource-requests",getResourceRequests)

//exporting admin route
module.exports=adminApp