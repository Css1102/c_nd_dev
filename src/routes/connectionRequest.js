const express=require('express')
const connectionReqRouter=express.Router()
const {userModel}=require('../model/user.js')
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require('jsonwebtoken')
const {validateLogin}=require('../utils/valid.js')
const {Auth}=require('../middleware/auth.js')
const {ConnectionRequest}=require('../model/connectionRequest.js')
connectionReqRouter.post('/request/send/:status/:toUserId',Auth,async(req,res)=>{
try{
const fromUserId=req.user._id 
const toUserId=req.params.toUserId
const status=req.params.status

const connectionRequest=new ConnectionRequest({
requestFrom:fromUserId,
 requestTo:toUserId,
 status:status,
});

const AllowedStatus=["interested","ignored"]
if(!AllowedStatus.includes(status)){
throw new Error("given status is prohibited")
}
const isExistingRequest=await ConnectionRequest.findOne({
$or:[{requestFrom:fromUserId,requestTo:toUserId}
,{requestFrom:toUserId,
 requestTo:fromUserId
}
],
})
console.log(isExistingRequest)
const userExist=await userModel.findById(toUserId)
if(!userExist){
res.status(404).json({message:"User not found"})
}
if(isExistingRequest){
res.status(400).json({message:"Already existing request between same users"})
}
const data=await connectionRequest.save()
res.json({
message:"Connection request send successfully",
data:data,
})
}
catch(err){
res.status(400).send(err.message)
}
})

module.exports={connectionReqRouter}