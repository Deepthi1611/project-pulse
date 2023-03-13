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


// Association between TeamComposition and Employee(one-many)
TeamComposition.Employee = TeamComposition.hasMany(Employee, {
  foreignKey: "projectId",
});

// Association between project and team composition model (one-to-many)
Projects.TeamComposition = Projects.hasMany(TeamComposition, {
  foreignKey: "projectId",
});

//adding team members to project
exports.team=expressAsyncHandler(async(req,res)=>{
  await TeamComposition.create(req.body);
  await Employee.update({"projectId":req.body.projectId},{where:{"empId":req.body.empId}})
  res.status(201).send({message:"Team member added"})
})

//updating team member details
exports.updateTeam=expressAsyncHandler(async (req,res)=>{
  //get projectId and empId from req.body
  let projectId=req.body.projectId
  let empId=req.body.empId
  //check if employee exists in that project
  let team=await TeamComposition.findOne({where: {
    [Op.and]: [
      { "projectId": projectId},
      { "empId": empId }
    ]
  }
  })
  //if employee does not exist in that project
  if(team==undefined){
    res.send({message:"employee does not exist in that project"})
  }
  //if present update details
  else{
    let {projectId,empId,empName,role,startDate,status,billingStatus,exposedToCustomer,allocationType}=req.body
    await TeamComposition.update({ "projectId":projectId,"empId":empId,"empName":empName,"role":role,"startDate":startDate,
    "status":status,"billingStatus":billingStatus,"exposedToCustomer":exposedToCustomer,"allocationType":allocationType},
    {where:{
      [Op.and]: [
        { "projectId": projectId},
        { "empId": empId }
      ]
    }})
    res.send({message:"employee details in the team updated"})
  }
})

//delete team member details
exports.deleteTeamMember=expressAsyncHandler(async (req,res)=>{
  //get projectId and EmpId from req.params
  let projectId=req.params.projectId
  let empId=req.params.empId
  //check if the employee exist in that project
  let team=await TeamComposition.findOne({where: {
    [Op.and]: [
      { "projectId": projectId},
      { "empId": empId }
    ]
  }
  })
  //if employee does not exist in that project
  if(team==undefined){
    res.send({message:"employee does not exist in that project"})
  }
  //if present delete employee from that team
  else{
    await TeamComposition.destroy({where:{
      [Op.and]: [
        { "projectId": projectId},
        { "empId": empId }
      ]
    }})
    res.send({message:"Team member deleted"})
  }
})

//raising a resource request for a project
exports.resourceRequest=expressAsyncHandler(async (req,res)=>{
  await ResourcingRequest.create(req.body)
  res.status(201).send({message:"resourcing request raised"})
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
        "projectId",
        "gdoId",
        "projectManager",
        "hrManager",
        "domain",
        "typeOfProject",
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
  let gdoEmailFromUrl = req.params.gdoEmail;

  // query to get the particular projectId and its project updates and project concerns by associations
  let projectRecord = await Projects.findOne({
    where: {
      projectId: projectIdFromUrl,
      gdoHeadEmail: gdoEmailFromUrl,
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

  //if project record not found
  if(projectRecord==undefined){
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
  console.log(newDate)
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