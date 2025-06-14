const express=require("express")
const app=express()
const {DBConnect}=require('./config/database.js')
const {userModel}=require('./model/user.js')
// middleware used to convert the json data from request into js object and pushing into db
app.use(express.json())
app.post('/signup',async(req,res)=>{
console.log(req)
// creating instance of the user model and pushing the data into the collection.
const user=new userModel(req.body)
await user.save()
res.send("Data sent to db")
})
app.get('/user',async(req,res)=>{
const userEmail=req.body?.email
try{
const user=await userModel.findOne({email:userEmail})
if(!user){
res.status(400).send("user not found")
}
else{
res.send(user)
}
}
catch(err){
console.log("oops some issue is there")
}
})

app.delete('/user',async(req,res)=>{
const userId=req.body?._id
try{
const deleted=await userModel.findByIdAndDelete(userId)
if(!deleted){
res.status(401).send("something went wrong")
}
else{
res.send("User deleted successfully")
}
}
catch(err){
console.log("oops something went wrong")
}
})

app.patch('/user/:userId',async(req,res)=>{
const userId=req.params?.userId;
const data=req.body
try{
const ALLOWED_UPDATES=["gender","skills","age","photoUrl","about"]
const isAllowedUpdate=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))
if(!isAllowedUpdate){
throw new Error("updating given field not allowed")
}
if(data.skills.length>10){
throw new Error("more than 10 skills not allowed")
}
const updatedObj=await userModel.findByIdAndUpdate({_id:userId},data,{returnDocument:"after"},{runValidator:true})
if(!updatedObj){
res.status(401).send("something went wrong")
}
else{
res.send(updatedObj)
}
}
catch(err){
console.log("oops something crashed"+err.message)
}
})

app.get('/feed',async(req,res)=>{
try{
const users=await userModel.find({})
if(users.length===0){
res.status(401).send("Something went wrong")
}
else{
res.send(users)
}
}
catch(e){
res.status(404).send("user not found")
}
})
DBConnect().then(()=>{
console.log("database connection estabished")
app.listen(7646,()=>{
console.log("listening at port no 7646")
})
}).catch((err)=>{
console.error("Database not connected there is some error")
})
