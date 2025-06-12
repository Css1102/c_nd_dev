const express=require("express")
const app=express()
const {DBConnect}=require('./config/database.js')
const {userModel}=require('./model/user.js')


app.post('/signup',async(req,res)=>{
const userObj={
firstName:"Akshay",
lastName:"Saini",
email:"akshaysaini@gmail.com",
age:28,
password:"akshay@123"
}
// creating instance of the userSchema and pushing the data into the collection.
const user=new userModel(userObj)
await user.save()
res.send("Data sent to db")
})
// first we need to connect to the database only then we should listen to the server so app.listen is 
// nested inside the then block of dbconnect function
DBConnect().then(()=>{
console.log("database connection estabished")
app.listen(7646,()=>{
console.log("listening at port no 7646")
})
}).catch((err)=>{
console.error("Database not connected there is some error")
})
