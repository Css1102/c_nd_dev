const express=require('express')
const profileRouter=express.Router()
const {userModel}=require('../model/user.js')
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require('jsonwebtoken')
const {validateLogin}=require('../utils/valid.js')
const {Auth}=require('../middleware/auth.js')
const {validateEditProfile}=require('../utils/valid.js')

profileRouter.use(cookieParser())
profileRouter.use(express.json())

profileRouter.get('/profile/view',Auth,async(req,res)=>{
try{
const userProfile=req.user
// console.log(userProfile)
if(!userProfile){
throw new Error("Invalid user")
}
res.json({message:"the user profile is",
data:userProfile
})
}
catch(err){
res.status(400).send(err.message)
}
})

profileRouter.patch('/profile/edit',Auth,async(req,res)=>{
try{
validateEditProfile(req.body)
const loggedInUser=req.user
Object.keys(req.body).forEach((rb)=>{
return loggedInUser[rb]=req.body[rb]
}
)

await loggedInUser.save()
res.json({
message:`${loggedInUser.firstName}, your profile is updated successfully`,
data:loggedInUser
})
}
catch(err){
res.status(400).send(err.message)
}
})
profileRouter.post('/profile/forgotPassword',async(req,res)=>{
try{
const email=req.body.email
const passwordOld=req.body.password
const userExist=await userModel.findOne({email:email})
if(!userExist){
throw new Error("User not found in Db")
}
const oldPasswrdComp=await bcrypt.compare(passwordOld,userExist.password)
if(!oldPasswrdComp){
throw new Error("Password doesnt match")
}
const newPassword=await bcrypt.hash(req.body.new_password,10)
const userWithNewPassword=await userModel.findOneAndUpdate({_id:userExist._id},{password:newPassword})
res.send("Password is updated successfully!")
}
catch(err){
res.status(400).send(err.message)
}
})

module.exports={profileRouter}

