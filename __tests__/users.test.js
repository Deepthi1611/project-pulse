const sequelize = require("../db/db.config");
const request = require("supertest");
const app = require("../server");

var token;
//register user
test("It should send user already registered",async()=>{
  const res = await request(app).post("/user-api/register").send({
  "email":"sashi.dummy@westagilelabs.com",
  "username":"Sashi",
  "password":"sashi"})
  // console.log("registration",res.status)
  expect(res.status).toBe(409)
})

//successful login
test('user should login successfully',async()=>{
  const res=await request(app).post("/user-api/login").send({
  "email":"sashi.dummy@westagilelabs.com",
  "password":"sashi"
  })
  token=res.body.token
  console.log(token)
  expect(res.status).toBe(200)
})

//invalid login
test('user login should be unsuccessful',async()=>{
  const res= await request(app).post("/user-api/login").send({
  "email":"test@westagilelabs.com",
  "password":"testgdo"
  })
  expect(res.status).toBe(401)
})

//super admin should get users details
test('super admin should get users details',async()=>{
  const res=await request(app).get('/super-admin-api/users')
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3VwZXIgYWRtaW4iLCJlbWFpbCI6InNhcmF0aEB3ZXN0YWdpbGVsYWJzLmNvbSIsImlhdCI6MTY3ODg1MjczNiwiZXhwIjoxNjc4ODcwNzM2fQ.K6VkvYlJWZoeDKp5yZ6bmiJZTo7shNAr7uM9lIC-NlM')
  expect(res.status).toBe(200)
  console.log("response body",res.body)
  // expect(res.body.length).toBe(4)
})

//super admin should assign role to user
test('super admin should assign role to user',async()=>{
  const res=await request(app).put('/super-admin-api/user/role')
  .send({
  "email":"testgdo@westagilelabs.com",
  "role":"GDO head"
  })
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3VwZXIgYWRtaW4iLCJlbWFpbCI6InNhcmF0aEB3ZXN0YWdpbGVsYWJzLmNvbSIsImlhdCI6MTY3ODg1MjczNiwiZXhwIjoxNjc4ODcwNzM2fQ.K6VkvYlJWZoeDKp5yZ6bmiJZTo7shNAr7uM9lIC-NlM')
  expect(res.status).toBe(409)
})

//admin should get all the projects
test('It should get all projects of admin',async()=>{
  // console.log(token)
  const res=await request(app).get('/admin-api/projects')
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4iLCJlbWFpbCI6InNhc2hpLmR1bW15QHdlc3RhZ2lsZWxhYnMuY29tIiwiaWF0IjoxNjc4NzkxNjkyLCJleHAiOjE2Nzg4MDk2OTJ9.6f_ECgi9G8IFZepqEa9NRV7miVE7FYLXSfEh0KSaQ_0')
  expect(res.status).toBe(200)
  expect(res.body.length).toBe(13)
})

//admin should create a project
// test('Admin should create a project',async()=>{
// const res=await request(app).post('/admin-api/project').send({
// "projectName":"project 8",
// "client":"vishnu",
// "clientAccountManager":"pavan",
// "statusOfProject":"In progress",
// "startDate" :"2023/02/19",
// "overallProjectFitnessIndicator":"green",
// "domain":"testing",
// "typeOfProject":"manual testing",
// "teamSize":3,
// "gdoHeadEmail":"ravi@westagilelabs.com",
// "projectManagerEmail":"priya@westagilelabs.com"
//   }).set('Authorization', 'bearer '+ 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4iLCJlbWFpbCI6InNhc2hpLmR1bW15QHdlc3RhZ2lsZWxhYnMuY29tIiwiaWF0IjoxNjc4NzkxNjkyLCJleHAiOjE2Nzg4MDk2OTJ9.6f_ECgi9G8IFZepqEa9NRV7miVE7FYLXSfEh0KSaQ_0')
//   expect(res.status).toBe(201)
// })

//Admin should update project details
test('Admin should update project details',async()=>{
  const res=await request(app).put('/admin-api/projectId/1')
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4iLCJlbWFpbCI6InNhc2hpLmR1bW15QHdlc3RhZ2lsZWxhYnMuY29tIiwiaWF0IjoxNjc4NzkxNjkyLCJleHAiOjE2Nzg4MDk2OTJ9.6f_ECgi9G8IFZepqEa9NRV7miVE7FYLXSfEh0KSaQ_0')
  expect(res.status).toBe(204)
})

//Admin should delete a project
test('admin should delete a project',async()=>{
  const res=await request(app).delete('/admin-api/projectId/11')
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4iLCJlbWFpbCI6InNhc2hpLmR1bW15QHdlc3RhZ2lsZWxhYnMuY29tIiwiaWF0IjoxNjc4NzkxNjkyLCJleHAiOjE2Nzg4MDk2OTJ9.6f_ECgi9G8IFZepqEa9NRV7miVE7FYLXSfEh0KSaQ_0')
  expect(res.status).toBe(204)
})

//GDO HEAD should get all project details under him
test('gdo head should get projects under him',async()=>{
  const res=await request(app).get('/gdoHead-api/projects')
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiR0RPIGhlYWQiLCJlbWFpbCI6InJhdmlAd2VzdGFnaWxlbGFicy5jb20iLCJpYXQiOjE2Nzg3OTE2MDEsImV4cCI6MTY3ODgwOTYwMX0.2sN8dp6ZhK_CVGrzRRRtezxYV2In8SbIlBg41vTMSms' )
  expect(res.status).toBe(200)
})

//GDO HEAD should update team details
test('gdo head should update team details',async()=>{
  const res=await request(app).put('/gdoHead-api/update-team').send({
"projectId":1,
"empId":1,
"empName":"Deepthi",
"role":"Dev",
"startDate":"2023/01/19",
"status":"Active",
"billingStatus":"buffer",
"exposedToCustomer":true,
"allocationType":"permanent"
  })
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiR0RPIGhlYWQiLCJlbWFpbCI6InJhdmlAd2VzdGFnaWxlbGFicy5jb20iLCJpYXQiOjE2Nzg3OTE2MDEsImV4cCI6MTY3ODgwOTYwMX0.2sN8dp6ZhK_CVGrzRRRtezxYV2In8SbIlBg41vTMSms')
  expect(res.status).toBe(200)
})

//GDO head should get specific project details
test('GDO head should get specific project details under him',async()=>{
  const res=await request(app).get('/gdoHead-api/projectId/9/gdoEmail/testgdo@westagilelabs.com')
  .set('Authorization','bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiR0RPIGhlYWQiLCJlbWFpbCI6InRlc3RnZG9Ad2VzdGFnaWxlbGFicy5jb20iLCJpYXQiOjE2Nzg3OTM5MTUsImV4cCI6MTY3ODgxMTkxNX0.mThm3BCmlB5wVEJBrjYO60VIOVf9aetehlinQEfZ89w')
  expect(res.status).toBe(200)
})

//project manager should get the project under him
test('project manager should get project under him',async()=>{
  const res=await request(app).get('/project-manager-api/project/srikar@westagilelabs.com')
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicHJvamVjdCBtYW5hZ2VyIiwiZW1haWwiOiJzcmlrYXJAd2VzdGFnaWxlbGFicy5jb20iLCJpYXQiOjE2Nzg3OTE5MzgsImV4cCI6MTY3ODgwOTkzOH0.y5SKZXUKw-ZS3Usmqln8_k3ircVe4LXGBGdP2sxoMnQ' )
  expect(res.status).toBe(200)
})

//project manager should update project concerns
test('project manager should update project concerns',async()=>{
  const res=await request(app).put("/project-manager-api/update-concern/projectId/1")
  .send({
    "projectId":1,
  "concernDescription":"More systems required",
  "raisedBy":"srikar@westagilelabs.com",
  "raisedOnDate":"2023/03/04",
  "severity":"Critical",
  "concernRaisedInternallyOrNot":true,
  "status":"mitigated",
  "mitigatedOn":"2023/03/06"
  })
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicHJvamVjdCBtYW5hZ2VyIiwiZW1haWwiOiJzcmlrYXJAd2VzdGFnaWxlbGFicy5jb20iLCJpYXQiOjE2Nzg3OTE5MzgsImV4cCI6MTY3ODgwOTkzOH0.y5SKZXUKw-ZS3Usmqln8_k3ircVe4LXGBGdP2sxoMnQ' )
  expect(res.status).toBe(200)
})

//project manager should update project concerns
test('project manager should update project concerns',async()=>{
  const res=await request(app).put("/project-manager-api/update-concern/projectId/1")
  .send({ 
  "projectId":1,
  "concernDescription":"More systems required",
  "raisedBy":"srikar@westagilelabs.com",
  "raisedOnDate":"2023/03/04",
  "severity":"Critical",
  "concernRaisedInternallyOrNot":true,
  "status":"mitigated",
  "mitigatedOn":"2023/03/06"
  })
  .set('Authorization', 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicHJvamVjdCBtYW5hZ2VyIiwiZW1haWwiOiJzcmlrYXJAd2VzdGFnaWxlbGFicy5jb20iLCJpYXQiOjE2Nzg3OTE5MzgsImV4cCI6MTY3ODgwOTkzOH0.y5SKZXUKw-ZS3Usmqln8_k3ircVe4LXGBGdP2sxoMnQ' )
  expect(res.status).toBe(200)
})

//project manager should delete project concerns
test('project manager should delete project concerns',async()=>{
  const res=await request(app).delete('/project-manager-api/project-concern/projectId/4')
  .set('Authorization','bearer '+ 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicHJvamVjdCBtYW5hZ2VyIiwiZW1haWwiOiJzcmlrYXJAd2VzdGFnaWxlbGFicy5jb20iLCJpYXQiOjE2Nzg3OTE5MzgsImV4cCI6MTY3ODgwOTkzOH0.y5SKZXUKw-ZS3Usmqln8_k3ircVe4LXGBGdP2sxoMnQ' )
  expect(res.status).toBe(204)
})