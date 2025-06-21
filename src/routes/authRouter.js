const express=require('express')
const authRouter=express.Router()
const {userModel}=require('../model/user.js')
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require('jsonwebtoken')
const {validateLogin}=require('../utils/valid.js')
const {Auth}=require('../middleware/auth.js')

authRouter.use(express.json())
authRouter.use(cookieParser())
// cookie parser is used to parse the cookie sent from the browser and decipher it

authRouter.post('/signup',async(req,res)=>{
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
authRouter.post('/login',async(req,res)=>{
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
const token=await user.getJWT()
res.cookie("token",token)
console.log(token)
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

authRouter.post('/logout',async(req,res)=>{
res.cookie("token",null,{
expires:new Date(Date.now())
})
console.log(res.mountPath)
res.send("User logged out sucessfully")
})
module.exports={authRouter}