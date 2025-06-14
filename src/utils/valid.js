const validator=require('validator')

const validateSignup=(data)=>{
if(!data.firstName || !data.lastName){
throw new Error("Name cannot be empty")
}

}
