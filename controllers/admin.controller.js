//import express-async-handler
const expressAsyncHandler=require("express-async-handler")
//import project model
const {Projects}=require("../db/models/projects.model")

// import projectUpdatesModel
const { ProjectUpdates } = require("../db/models/project_updates.model");

// import projectconcern Model
const { ProjectConcerns } = require("../db/models/project_concerns.model");

// import Team composition model
const { TeamComposition } = require("../db/models/team_composition.model");

//import resource request model
const {ResourcingRequest} = require("../db/models/resourcing_request.model")


// Association between Project and ProjectUpdates (one-to-many)
Projects.ProjectUpdates = Projects.hasMany(ProjectUpdates, {
  foreignKey: "projectId",
});

// Association between Project and Project Concern (one-to-many)
Projects.ProjectConcerns = Projects.hasMany(ProjectConcerns, {
  foreignKey: "projectId",
});

// Association between project and team composition model (one-to-many)
Projects.TeamComposition = Projects.hasMany(TeamComposition, {
  foreignKey: "projectId",
});

//creating a project
exports.project=expressAsyncHandler(async (req,res)=>{
  //create a project from req.body
  await Projects.create(req.body)
  res.status(201).send({message:"Project created"})
})

// get all projects
exports.getProjects = expressAsyncHandler(async (req, res) => {
  let projects = await Projects.findAll({
    attributes: {
      exclude: [
        "projectId",
        "gdoId",
        "projectManager",
        "domain",
        "typeOfProject",
      ],
    },
  });
  // if there are no projects
  if (projects.length == 0) {
    res.status(204).send({ message: "No Projects Available" });
  }
  // if projects are available, display projects
  else {
    res.status(200).send({ message: "All projects", payload: projects });
  }
});

// get specific project details
exports.getSpecificProjectDetails = expressAsyncHandler(async (req, res) => {
  // get the projectId from req.params
  let projectIdFromUrl = req.params.projectId;

  // query to get the particular projectId and its project updates and project concerns by associations
  let projectRecord = await Projects.findOne({
    where: {
      projectId: projectIdFromUrl
    },

    include: [
      
      {
        association: Projects.ProjectConcern,
      },
      {
        association: Projects.TeamComposition,
      },
    ],
  });

  //if project is not present
  if(projectRecord==undefined){
    res.status(204).send({message:"Project not found"})
  }

  //if project is present, return project record
  else{
  // return project fitness, concern indicator ,Team members from projectRecord
  let projectFitness = projectRecord.dataValues.overallProjectFitnessIndicator;
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
  //find project updates that are within 2 weeks
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
    message: `Project Details for project with project Id ${projectIdFromUrl}`,
    projectFitness:projectFitness,
    concernIndicator: concernIndicator,
    teamSize: teamSize,
    payload: {projectRecord,"project_updates":newUpdates}
  });
}
});

//update project details
exports.updateProject=expressAsyncHandler(async (req,res)=>{
  let {projectId,projectName,client,clientAccountManager,statusOfProject,startDate,overallProjectFitnessIndicator,
    domain,typeOfProject,teamSize,gdoHeadEmail,projectManagerEmail}=req.body;
  //update project details
  let update=await Projects.update({"projectName":projectName,"client":client,"clientAccountManager":clientAccountManager,"statusOfProject":statusOfProject,"startDate":startDate,
  "overallProjectFitnessIndicator":overallProjectFitnessIndicator,"domain":domain,"typeOfProject":typeOfProject,"teamSize":teamSize,"gdoHeadEmail":gdoHeadEmail,"projectManagerEmail":projectManagerEmail},
  {where:{"projectId":projectId}})
  if(update==0){
    res.status(204).send({message:"Nothing new to update"})
  }
  else{
    res.status(200).send({message:"Updated successsfully"})
  }
})

//delete a project
exports.deleteProject=expressAsyncHandler(async (req,res)=>{
  let projectIdFromUrl=req.params.projectId
  let project=await Projects.findOne({where:{'projectId':projectIdFromUrl}})
  if(project==undefined){
    res.status(204).send({message:"project does not exist"})
  }
  else{
    Projects.destroy({where:{"projectId":projectIdFromUrl}})
    res.status(200).send({message:"project deleted"})
  }
})

//get resource requests
exports.getResourceRequests=expressAsyncHandler(async (req,res)=>{
 let resourcingRequests= await ResourcingRequest.findAll()
 //If there are no resourcing requests
 if(resourcingRequests==undefined){
  res.status(204).send({message:"no resourcing requests found"})
 }
 //if resourcing requests are present, display them
 else{
 res.status(200).send({message:"resourcing requests",payload:resourcingRequests})
}
})