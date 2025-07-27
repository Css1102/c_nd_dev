const validator=require('validator')
const {userModel}=require('../model/user')
const {ConnectionRequest}=require('../model/connectionRequest.js')

const validateSignup=(data)=>{
if(!data.firstName || !data.lastName){
throw new Error("Name cannot be empty")
}
}
const validateEditProfile=(data)=>{
const allowedEdits=["firstName","lastName","about","age","gender","photoUrl","skills"]

const isAllowedEdit=Object.keys(data).every((key)=>allowedEdits.includes(key))
if(!isAllowedEdit){
throw new Error("Invalid feild update request")
}
}
const validateLogin=(data)=>{
if(!data ||  !validator.isEmail(data)){
throw new Error("mail regex match failed")
}
}

const removeOrphanedChildren = async () => {
  const allRequests = await ConnectionRequest.find({});
  const existingUserIds = (await userModel.find({}, '_id')).map(u => u._id.toString());

  const orphanedRequests = allRequests.filter(req => {
    const senderId = req.sender?.toString();
    const receiverId = req.receiver?.toString();

    return !senderId || !receiverId ||
      !existingUserIds.includes(senderId) ||
      !existingUserIds.includes(receiverId);
  });

  const orphanedIds = orphanedRequests.map(req => req._id);
  await ConnectionRequest.deleteMany({ _id: { $in: orphanedIds } });

  console.log(`Cleaned ${orphanedIds.length} orphaned connection requests`);
};
const validatePassword=(password)=>{
if(!validator.isStrongPassword(password)){
throw new Error("password is too weak")
}
}
module.exports={validateLogin,validateEditProfile,removeOrphanedChildren,validatePassword}