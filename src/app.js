const express=require("express")
const app=express()

app.use('/home',(req,res)=>{
res.send("This is called from the home method")
})
app.use('/test',(req,res)=>{
res.send("This is my test in the course")
})
app.listen(7646,()=>{
console.log("listening at port no 7646")
})