const express=require('express')
const authRouter=express.Router()
const {userModel}=require('../model/user.js')
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require('jsonwebtoken')
const {validateLogin}=require('../utils/valid.js')
const validator=require('validator')
const {Auth}=require('../middleware/auth.js')
const{validatePassword}=require('../utils/valid.js')
authRouter.use(express.json())
authRouter.use(cookieParser())
// cookie parser is used to parse the cookie sent from the browser and decipher it

authRouter.post('/signup',async(req,res)=>{
try{
// We need to validate the data using util functions
// we need to encrypt the passwords
const {email,password,firstName,lastName}=req.body;
if(!email||!password){
throw new Error("All feilds are mandatory")
}
const doesUserExist=await userModel.findOne({email:email})
if(doesUserExist){
throw new Error("Already existing user please login")
}
validatePassword(password)
validateLogin(email)
const passwordHash=await bcrypt.hash(password,10)
// creating instance of the user model and pushing the data into the collection.
const user=new userModel({
firstName:firstName,
lastName:lastName,
password:passwordHash,
email:email,
// gender:gender,
// photoUrl:photoUrl,
// about:about,
// skills:skills,

}
)
const token=await user.getJWT()
res.cookie("token",token)
res.send(user)

const saveResponse=await user.save()
res.json({message:"Data sent to db",
    data:saveResponse
})
}
catch(err){
console.log("error:"+err.message)
res.status(400).send(err.message)
}
})
authRouter.post('/login',async(req,res)=>{
const{email,password}=req.body
// validateLogin(email)
try{
const user=await userModel.findOne({email:email})
if(!user){
throw new Error("invalid credentials")
}
const passwordValid=await bcrypt.compare(password,user?.password)

if(passwordValid){
// We pass the userId and a private key inside the jwt.sign method and the browser recieves a jwt
// token which will be sent to the server everytime the user hits an API.
const token=await user.getJWT()
res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"None"})
res.send({token,user})
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
res.send("User logged out sucessfully")
})
module.exports={authRouter}