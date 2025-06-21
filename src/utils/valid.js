const validator=require('validator')

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

module.exports={validateLogin,validateEditProfile}