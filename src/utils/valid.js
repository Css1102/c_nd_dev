const validator=require('validator')

const validateSignup=(data)=>{
if(!data.firstName || !data.lastName){
throw new Error("Name cannot be empty")
}
}

const validateLogin=(data)=>{
if(!data ||  !validator.isEmail(data)){
throw new Error("mail regex match failed")
}
}

module.exports={validateLogin}