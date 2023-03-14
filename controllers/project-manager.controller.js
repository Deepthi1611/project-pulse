//import express-async-handler
const expressAsyncHandler=require("express-async-handler")

// import Project Model
const { Projects } = require("../db/models/projects.model");

// import projectUpdatesModel
const { ProjectUpdates } = require("../db/models/project_updates.model");

// import projectconcerns model
const { ProjectConcerns } = require("../db/models/project_concerns.model");

//import Op from sequelize
const {Op}=require("sequelize")

//SMTP SETUP

//import nodemailer
const nodemailer = require('nodemailer');
const { Users } = require("../db/models/users.model");

//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD // app password
  }
})


// Association between Project and ProjectUpdates (one-to-many)
Projects.ProjectUpdates = Projects.hasMany(ProjectUpdates, {
  foreignKey: "projectId",
});

// Association between Project and Project Concern (one-to-many)
Projects.ProjectConcern = Projects.hasMany(ProjectConcerns, {
  foreignKey: "projectId",
});

// projectUpdates updated by projectManager
exports.projectUpdate = expressAsyncHandler(async (req, res) => {
  // insert the data into projectupdates model
  await ProjectUpdates.create(req.body);
  res.status(201).send({ message: "Project Updates created" });
});

// raise project concerns by project manager
exports.raiseProjectConcern = expressAsyncHandler(async (req, res) => {
  let emails=await Users.findAll({where:{"role":"Admin"}})
  let adminEmails=emails.map((userObject)=>userObject.dataValues.email)
  let projectRecord=await Projects.findOne({where:{"projectId":req.body.projectId}})
  let gdoHeadEmail=projectRecord.dataValues.gdoHeadEmail
  adminEmails.push(gdoHeadEmail)
  let mailOptions = {
    from: "projectpulse133@gmail.com",
    to: adminEmails,
    subject: `Project concern is raised for project ${req.body.projectId} by ${req.body.raisedBy}`,
    text: `Hello Admin,
     A project concern is raised for the above project and the concern description is: ${req.body.concernDescription}
     severity of project concern:${req.body.severity} `,
  };
  //send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  //insert into project_concerns table
  await ProjectConcerns.create(req.body)
  //send response
  res.status(201).send({ message: "Project concern is raised" });
});

//get project for project manager
exports.getProjects = expressAsyncHandler(async (req, res) => {
  // get the project manager email from url
  let projectManagerEmailFromUrl = req.params.projectManagerEmail;

  // query to get the particular projectId and its project updates and project concerns by associations
  let projectRecord = await Projects.findOne({
    where: {
      projectManagerEmail: projectManagerEmailFromUrl,
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
    res.status(204).send({message:"project not found"})
  }
  //if project is found, return project record
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
    message: `Project Details for project with project manager ${projectManagerEmailFromUrl}`,
    projectFitness:projectFitness,
    concernIndicator: concernIndicator,
    teamSize: teamSize,
    payload: {projectRecord,"project_updates":newUpdates}
  });
}
});

//update project updates
exports.updateProjectUpdates=expressAsyncHandler(async (req,res)=>{
  //check if the project update exists
  let update=await ProjectUpdates.findOne({where:{projectId:req.body.projectId}})
  //if project update does not exist
  if(update==undefined){
    res.status(204).send({message:"Project update does not exist"})
  }
  //if project update exists, update new details
  else{
  let {projectId,projectManager,date,statusUpdate,scheduleStatus,resourcingStatus,qualityStatus,clientInputs}=req.body
  await ProjectUpdates.update({"projectManager":projectManager,"date":date,"statusUpdate":statusUpdate,
  "scheduleStatus":scheduleStatus,"resourcingStatus":resourcingStatus,"qualityStatus":qualityStatus,"clientInputs":clientInputs},
  {where:{"projectId":projectId}})
  res.status(200).send({message:`updated project updates with projectId: ${projectId}`})
}
})

//delete project updates
exports.deleteProjectUpdate=expressAsyncHandler( async (req,res)=>{
  //get projectId and Date from req.params
  let projectId=req.params.projectId
  let date=req.params.date
  //check if project update exists with those details
  let update=await ProjectUpdates.findOne({where: {"projectId":projectId}})
  console.log(update)
  //if project update is not present
  if(update==undefined){
    res.status(204).send({message:"project update does not exist"})
  }
  //if exists, delete the project update
  else{
    await ProjectUpdates.destroy({where:{"projectId":projectId}})
    res.status(200).send({message:"project update deleted"})
  }
})

//update project concern
exports.updateConcern=expressAsyncHandler(async (req,res)=>{
  //check if concern exist
  let concern=await ProjectConcerns.findOne({where:{"projectId":req.body.projectId}})
  //if concern does not exist
  if(concern==undefined){
    res.status(204).send({message:"project concern does not exist"})
  }
  //if concern exists update the details
  else{
    let {projectId,concernDescription,raisedBy,raisedOnDate,severity,concernRaisedInternallyOrNot,status,mitigatedOn}=req.body
    await ProjectConcerns.update({"concernDescription":concernDescription,"raisedBy":raisedBy,
    "raisedOnDate":raisedOnDate,"severity":severity,"concernRaisedInternallyOrNot":concernRaisedInternallyOrNot,
    "status":status,"mitigatedOn":mitigatedOn},{where:{"projectId":projectId,}})
    res.status(200).send({message:"project concerns updated"})
  }
})

//delete project concerns
exports.deleteConcern=expressAsyncHandler(async (req,res)=>{
  //get project id from req.params
  let projectId=req.params.projectId
  //check if project concern exists
  let concern=await ProjectConcerns.findOne({where:{"projectId":projectId}})
  //if concern does not exist
  if(concern==undefined){
    res.status(204).send({message:"concern does not exist"})
  }
  //if concern exist delete concern
  else{
    await ProjectConcerns.destroy({where:{"projectId":projectId}})
    res.status(200).send({message:"project concern deleted"})
  }
})