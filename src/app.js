const express=require("express")
const app=express()
const {DBConnect}=require('./config/database.js')
const {userModel}=require('./model/user.js')
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require('jsonwebtoken')
const {validateLogin}=require('./utils/valid.js')
const {Auth}=require('./middleware/auth.js')
// middleware used to convert the json data from request into js object and pushing into db
app.use(express.json())
app.use(cookieParser())
// cookie parser is used to parse the cookie sent from the browser and decipher it

app.post('/signup',async(req,res)=>{
try{
// We need to validate the data using util functions
// we need to encrypt the passwords
const {password,firstName,lastName,email,age}=req.body;
const passwordHash=await bcrypt.hash(password,10)
console.log(passwordHash)
// console.log(req)
// creating instance of the user model and pushing the data into the collection.
const user=new userModel({
firstName:firstName,
lastName:lastName,
age:age,
password:passwordHash,
email:email,
}
)
await user.save()
res.send("Data sent to db")
}
catch(err){
console.log("error:"+err.message)
}
})
app.post('/login',async(req,res)=>{
const{email,password}=req.body
// validateLogin(email)
try{
const user=await userModel.findOne({email:email})
if(!user){
    console.log("Hello")
throw new Error("invalid credentials")
}
const passwordValid=await bcrypt.compare(password,user?.password)

if(passwordValid){
// We pass the userId and a private key inside the jwt.sign method and the browser recieves a jwt
// token which will be sent to the server everytime the user hits an API.
const token=await userModel.getJWT
res.cookie("token",token,{expires:new Date(Date.now()+7*360000)})
res.send("login successfull")
}
else{
throw new Error("Invalid credentials")
}
}
catch(err){
res.status(400).send(err.message)
}
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
app.get('/profile',Auth,async(req,res)=>{
try{
const userProfile=req.user
if(!userProfile){
throw new Error("Invalid user")
}
res.send("the user profile is" + '\n'+ userProfile)
}
catch(err){
res.status(400).send(err.message)
}
})
app.post('/sendConnectionReq',Auth,async(req,res)=>{
try{
const user=req.user
console.log(user.firstName+" "+"Is sending the request")
res.send("Connection request sent successfully")
}
catch(err){
res.status(400).send(err.message)
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
