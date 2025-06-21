const mongoose=require("mongoose")

const connectionRequestSchema=new mongoose.Schema({
requestFrom:{
type:mongoose.Schema.Types.ObjectId,
required:true
},
requestTo:{
type:mongoose.Schema.Types.ObjectId,
required:true
},
status:{
type:String,
enum:{
values:["ignored","interested","accepted","rejected"],
message:`{VALUE} is incorrect status type`
}
}
},{timestamps:true})

connectionRequestSchema.index({requestFrom:1,requestTo:1})
connectionRequestSchema.pre('save',function(next){
const connectionRequest=this
if(connectionRequest.requestFrom.equals(connectionRequest.toUserId)){
throw new Error("You cannot send connection request to yourself")
}
next()
})
const ConnectionRequest=new mongoose.model('ConnectionRequest',connectionRequestSchema)

module.exports={ConnectionRequest}