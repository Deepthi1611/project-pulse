//importing express module
const exp=require("express")
//creating express mini application
const projectManagerApp=exp.Router()
//import middleware
const verifyToken=require("../middlewares/project-manager.middleware")

//body parser
projectManagerApp.use(exp.json())

//import from controller
let {projectUpdate,raiseProjectConcern,getProjects,updateProjectUpdates,deleteProjectUpdate,updateConcern,deleteConcern}=require("../controllers/project-manager.controller")

//project update
projectManagerApp.post("/projectId/:projectId/project-update",verifyToken,projectUpdate)

//raise project concern
projectManagerApp.post("/projectId/:projectId/raise-project-concern",verifyToken,raiseProjectConcern)

//update project updates
projectManagerApp.put("/update/project-updates/projectId/:projectId",verifyToken,updateProjectUpdates)

//delete project updates
projectManagerApp.delete("/projectId/:projectId/date/:date",verifyToken,deleteProjectUpdate)

//update project concerns
projectManagerApp.put("/update-concern/projectId/:projectId",verifyToken,updateConcern)

//delete project concerns
projectManagerApp.delete("/project-concern/projectId/:projectId",verifyToken,deleteConcern)

//get project details
projectManagerApp.get("/project/:projectManagerEmail",verifyToken,getProjects)

//export projectManagerApp
module.exports=projectManagerApp
