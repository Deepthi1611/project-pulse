//importing express module
const exp=require("express")
//creating express mini application
const gdoHeadApp=exp.Router()
//import middleware
const verifyToken=require("../middlewares/gdoHead.middleware")

//body parser
gdoHeadApp.use(exp.json())

//importing from controller
let {team,resourceRequest,getProjects,getSpecificProjectDetails,updateTeam,deleteTeamMember}=require("../controllers/gdoHead.controller")

//adding team member
gdoHeadApp.post("/team",verifyToken,team)

//raising a resource request
gdoHeadApp.post("/projectId/:projectId/resourcing-request",verifyToken,resourceRequest);

//get project details under him
gdoHeadApp.get("/projects/:gdoHead",verifyToken,getProjects)

//update team member details
gdoHeadApp.put("/update-team",verifyToken,updateTeam)

//delete team member
gdoHeadApp.delete("/delete-team-member/projectId/:projectId/empId/:empId",verifyToken,deleteTeamMember)

//get specific project details
gdoHeadApp.get("/projectId/:projectId/gdoEmail/:gdoEmail",verifyToken,getSpecificProjectDetails)

//export gdoHeadApp
module.exports=gdoHeadApp