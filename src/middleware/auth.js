const {userModel}=require('../model/user.js')
const jwt=require('jsonwebtoken')
const env=require('dotenv').config()
const Auth=async(req,res,next)=>{
try{
const {token}=req.cookies
const decodeMsg=await jwt.verify(token,process.env.SECRET_KEY)
const {_id}=decodeMsg
if(!_id){
throw new Error("Invalid token")
}
const userProfile=await userModel.findById(_id)
if(!userProfile){
throw new Error("Invalid user")
}
req.user=userProfile
next()
}
catch(err){
res.status(400).send(err.message)
}
}

module.exports={Auth}