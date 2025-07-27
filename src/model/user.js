const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
// External lib to validate the field values and their patterns
const validator=require('validator')
const env=require('dotenv').config()
const userSchema=new mongoose.Schema({
firstName:{
type:String,
required:true,
minLength:3,
maxLength:50,
},
lastName:{
type:String,
required:true
},
email:{
type:String,
required:true,
unique:true,
lowercase:true,
validate(value){
if(!validator.isEmail(value)){
throw new Error("Email is not in proper format")
}
}
},
password:{
type:String,
required:[true,"password is required"],
unique:true,
trim:true,
minLength:8,
},
age:{
type:Number,
min:18,
max:100,
},
gender:{
type:String,
// the validate method by default only runs on new documents that are added to out collection. 
// for it to run on existing document's updation we need to make runValidator opt argument as true.
validate(value){
if(!["Male","Female","Others"].includes(value)){
throw new Error("Gender not found")
}
}
},
photoUrl:{
type:String,
},
about:{
type:String
},
skills:{
type:[String]
},
},{timestamps:true});
userSchema.methods.getJWT=async function(){
const user=this;
const token=await jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn:"2d"})
return token;
}
const userModel=mongoose.model("User",userSchema)

module.exports={userModel}