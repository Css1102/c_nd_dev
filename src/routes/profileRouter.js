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
profileRouter.get('/profile/view',Auth,async(req,res)=>{
try{
const userProfile=req.user
console.log(userProfile)
if(!userProfile){
throw new Error("Invalid user")
}
res.send("the user profile is" + '\n'+ userProfile)
}
catch(err){
res.status(400).send(err.message)
}
})

profileRouter.patch('/profile/edit',Auth,async(req,res)=>{
try{
validateEditProfile(req.body)
const loggedInUser=req.user
Object.keys(req.body).forEach((rb)=>loggedInUser.key=rb.key)
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
profileRouter.patch('/profile/forgotPassword',Auth,async(req,res)=>{
try{
const user=req.user
const {token}=req.cookies
console.log(req.token)
const isLoggedIn= await jwt.verify(token,"Aksha@91unduURNEJjsj")

const {_id}=isLoggedIn
if(!_id){
throw new Error("The user is not logged in")
}
const passwordOld=req.old_password
const oldPasswrdComp=await bcrypt.compare(passwordOld,user.password)
if(!oldPasswrdComp){
throw new Error("Password doesnt match")
}
else{
const newPassword=await bcrypt.hash(req.new_password,10)
req.password=newPassword;
res.send("Password is updated successfully!")
}
}
catch(err){
res.status(400).send(err.message)
}
})

module.exports={profileRouter}

