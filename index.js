//import app from server
const app=require("./server")

//creating port number
const PORT=process.env.PORT||4000

//assigning port number
app.listen(PORT,()=>{
  console.log(`server started at ${PORT}`)
})