//import express-async-handler
const expressAsyncHandler=require("express-async-handler")

//import Op from sequelize
const {Op}=require("sequelize")

//import team-composition-model
const {TeamComposition}=require("../db/models/team_composition.model")

//import project model
const {Projects}=require("../db/models/projects.model")

//import Employee model
const {Employee}=require("../db/models/employee.model")

//import resourcingRequest model
const {ResourcingRequest}=require("../db/models/resourcing_request.model")

//import jwt
const jwt=require("jsonwebtoken")


//adding team members to project
exports.team=expressAsyncHandler(async(req,res)=>{
  let projectRecord=await Projects.findOne({where:{"projectId":req.body.projectId}})
  console.log(projectRecord)
  let gdoHead=projectRecord.gdoHeadEmail
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
    //decode the token
    //if token is invalid we get error otherwise token is valid
    let verify=jwt.verify(token,process.env.SECRET_KEY||"");
    if(verify.email==gdoHead){
      await TeamComposition.create(req.body);
      res.status(201).send({message:"Team member added"})
    }
    else{
      res.status(401).send({message:"You cannot add team members to a project that is not under you"})
    }
  }
})

//updating team member details
exports.updateTeam=expressAsyncHandler(async (req,res)=>{
  //get projectId and empId from req.body
  let projectId=req.body.projectId
  let projectRecord=await Projects.findOne({where:{"projectId":projectId}})
  let gdoHead=projectRecord.gdoHeadEmail
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
    //decode the token
    //if token is invalid we get error otherwise token is valid
    let verify=jwt.verify(token,process.env.SECRET_KEY||"");
    if(verify.email==gdoHead){
    let empId=req.body.empId
  //check if employee exists in that project
  let team=await TeamComposition.findOne({where: { "empId": empId }})
  //if employee does not exist in that project
  if(team==undefined){
    res.status(204).send({message:"employee does not exist in that project"})
  }
  //if present update details
  else{
    let empId=req.body.empId
    await TeamComposition.update(req.body,{where:{ "empId": empId }})
    res.status(200).send({message:"employee details in the team updated"})
  }
  }
    else{
      res.status(401).send({message:"You cannot update team member details of a a project that is not under you"})
    }
  }
})

//delete team member details
exports.deleteTeamMember=expressAsyncHandler(async (req,res)=>{
  let empId=req.params.empId
  console.log(empId)
  //check if the employee exist in that project
  let team=await TeamComposition.findOne({where: {"empId": empId }})
  //if employee does not exist in that project
  if(team==undefined){
    res.status(204).send({message:"employee does not exist in that project"})
  }
  //if present delete employee from that team
  else{
    await TeamComposition.destroy({where:{"empId": empId }})
    res.status(200).send({message:"Team member deleted"})
  }
})

//raising a resource request for a project
exports.resourceRequest=expressAsyncHandler(async (req,res)=>{
  let projectId=req.params.projectId
  let projectRecord=await Projects.findOne({where:{"projectId":req.body.projectId}})
  let gdoHead=projectRecord.gdoHeadEmail
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
    //decode the token
    //if token is invalid we get error otherwise token is valid
    let verify=jwt.verify(token,process.env.SECRET_KEY||"");
    if(verify.email==gdoHead){
    await ResourcingRequest.create(req.body)
    res.status(201).send({message:"resourcing request raised"})
    }
    else{
      res.status(401).send({message:"You cannot raise resource request to a project that is not under you"})
    }
  }
})

// get all the projects under him
exports.getProjects = expressAsyncHandler(async (req, res) => {
  // get the gdoId from url
  let gdoHeadFromUrl = req.params.gdoHead;

  // query to find all the projects for the gdoHead
  let projectRecord = await Projects.findAll({
    where: {
      gdoHeadEmail: gdoHeadFromUrl
    },
    attributes: {
      exclude: [
        "gdoId",
        "projectManager",
        "hrManager",
        "domain",
        "typeOfProject",
        "teamSize"
      ],
    },
  });
  // if there are no projects for gdo
  if (projectRecord.length == 0) {
    res.status(204).send({ message: "No projects under you" });
  }
  // if there are projects
  else {
    res.status(200).send({
      message: `Projects for gdoHead with email ${gdoHeadFromUrl}`,
      payload: projectRecord,
    });
  }
});

// get specific Project Details
exports.getSpecificProjectDetails = expressAsyncHandler(async (req, res) => {
  // get the projectId and gdoEmail from url
  let projectIdFromUrl = req.params.projectId;

  // query to get the particular projectId and its project updates and project concerns by associations
  let projectRecord = await Projects.findOne({
    where: {
      projectId: projectIdFromUrl,
    }, attributes:{exclude:["teamSize"]},
    include: [
      {
        association: Projects.ProjectConcern,
      },
      {
        association: Projects.TeamComposition,
      },
    ],
  });
  console.log(projectRecord)
  //if project record not found
  if(projectRecord===null){
    res.status(204).send({message:"Project not found"})
  }
  //if project found return project record
  else{
  // return project fitness, concern indicator ,Team members get these values from projectRecord
  let projectFitness = projectRecord.dataValues.overAllProjectFitnessIndicator;
  // find team size
  let teamSize = 0;
  projectRecord.dataValues.team_compositions.forEach((teamMemeber)=>{
    if(teamMemeber.billingStatus=='billed') teamSize++;
  });
  // find number of concerns that are active
  let concernIndicator = 0;
  projectRecord.dataValues.project_concerns.forEach((concern) => {
    if (concern.statusOfConcern == "pending") concernIndicator++;
  });
  //consider project updates that are within 2 weeks
  let updates=await projectRecord.getProject_updates()
  let newUpdates=[]
  let date=new Date()
  let prevDate=date.getDate() - (date.getDay() - 1) - 14
  let newDate=new Date(date.setDate(prevDate))
  updates.forEach((updateObject)=>{
    if(updateObject.dataValues.date>newDate){
      newUpdates.push(updateObject)
    }
  })
  // send response
  res.status(200).send({
    message: `Project Detaitls for projectId ${projectIdFromUrl}`,
    projectFitness: projectFitness,
    teamSize: teamSize,
    concernIndicator: concernIndicator,
    payload: {projectRecord,"project_updates":newUpdates}
  });
}
});