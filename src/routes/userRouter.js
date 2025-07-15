const express=require('express')
const userRouter=express.Router()
const {userModel}=require('../model/user.js')
const {Auth}=require('../middleware/auth.js')
const {ConnectionRequest}=require('../model/connectionRequest.js')
const {removeOrphanedChildren}=require('../utils/valid.js')
userRouter.get('/user/requests/recieved',Auth,async(req,res)=>{
try{
const loggedInUser=req.user

const requests=await ConnectionRequest.find({
requestTo:loggedInUser._id,
status:"interested"
}
).populate("requestFrom",["firstName","lastName","gender","photoUrl","about","age","skills"])

res.json({
message:"Data fetched successfully",
data:requests
})
}
catch(err){
res.status(400).send(err.message)
}
})

userRouter.get('/user/connections',Auth,async(req,res)=>{
try{
const loggedInUser=req.user
// await removeOrphanedChildren()
const connectionRequest=await ConnectionRequest.find({
$or:[{requestFrom:loggedInUser._id,status:"accepted"}
    ,{requestTo:loggedInUser._id,status:"accepted"}]
}).populate("requestFrom",["firstName","lastName","gender","photoUrl","about","age","skills","createdAt"]).
populate("requestTo",["firstName","lastName","gender","photoUrl","about","age","skills","createdAt"])
const data=connectionRequest.map((row)=>{
if(row.requestFrom._id.toString()===loggedInUser._id.toString()){
return row.requestTo
}
return row.requestFrom
})
res.json({
message:"These are your connections",
data:data
})
}
catch(err){
res.status(400).send(err.message);
}
})

userRouter.get('/user/feed',Auth,async(req,res)=>{
try{
const loggedInUser=req.user
const page=parseInt(req.query.page) || 1
let limit=parseInt(req.query.limit) || 10
limit=limit>50?50:limit
const skipCount=(page-1)*limit
const connectionRequest=await ConnectionRequest.find({
$or:[{requestFrom:loggedInUser._id},
{requestTo:loggedInUser._id}]
}).select("requestFrom requestTo")
const hideUsersFromFeed=new Set()
connectionRequest.forEach((item)=>{
hideUsersFromFeed.add(item.requestFrom._id.toString())
hideUsersFromFeed.add(item.requestTo._id.toString())
});
const SAFE_DATA="firstName lastName gender photoUrl about age skills"

// const feedUsers=await userModel.find({
// $and:[{_id:{$nin:Array.from(hideUsersFromFeed)}},{_id:{$ne:loggedInUser._id}}]
// }).select(SAFE_DATA).skip(skipCount).limit(limit)
const excludedIds = new Set([loggedInUser._id.toString()]);
connectionRequest.forEach(item => {
  excludedIds.add(item.requestFrom._id.toString());
  excludedIds.add(item.requestTo._id.toString());
});

const feedUsers = await userModel.find({
  _id: { $nin: Array.from(excludedIds) }
})
.select(SAFE_DATA)
.skip(skipCount)
.limit(limit);
res.send(feedUsers)
}
catch(err){
res.status(400).send(err.message);
}
})
module.exports={userRouter}