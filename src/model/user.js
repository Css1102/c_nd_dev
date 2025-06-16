const mongoose=require('mongoose')
// External lib to validate the field values and their patterns
const validator=require('validator')
const userSchema=new mongoose.Schema({
firstName:{
type:String,
required:true,
minLength:4,
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
validate(value){
if(!validator.isStrongPassword(value)){
throw new Error("password is too weak")
}
}

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
}
},{timestamps:true});

const userModel=mongoose.model("User",userSchema)

module.exports={userModel}