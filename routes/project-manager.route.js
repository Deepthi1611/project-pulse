//importing express module
const exp=require("express")
//creating express mini application
const projectManagerApp=exp.Router()
//import middleware
const verifyToken=require("../middlewares/project-manager.middleware")

//body parser
projectManagerApp.use(exp.json())

//import from controller
let {projectUpdate,raiseProjectConcern,getProjects,getProject,updateProjectUpdates,deleteProjectUpdate,updateConcern,deleteConcern}=require("../controllers/project-manager.controller")

//project update
projectManagerApp.post("/project-updates",verifyToken,projectUpdate)

//raise project concern
projectManagerApp.post("/raise-project-concern",verifyToken,raiseProjectConcern)

//update project updates
projectManagerApp.put("/update/project-updates/projectId/:projectId",verifyToken,updateProjectUpdates)

//delete project updates
projectManagerApp.delete("/projectId/:projectId/date/:date",verifyToken,deleteProjectUpdate)

//update project concerns
projectManagerApp.put("/update-concern/projectId/:projectId",verifyToken,updateConcern)

//delete project concerns
projectManagerApp.delete("/project-concern/projectId/:projectId",verifyToken,deleteConcern)

//get project details
projectManagerApp.get("/projects/:projectManagerEmail",verifyToken,getProjects)

//get specific project
projectManagerApp.get("/project/:projectId",verifyToken,getProject)

//export projectManagerApp
module.exports=projectManagerApp
