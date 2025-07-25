const express=require("express")
const app=express()
const env=require('dotenv').config()
const {DBConnect}=require('./config/database.js')
const {userModel}=require('./model/user.js')
const {authRouter}=require('./routes/authRouter.js')
const {userRouter}=require('./routes/userRouter.js')
const {profileRouter}=require('./routes/profileRouter.js')
const {connectionReqRouter}=require('./routes/connectionRequest.js')
const cookieParser=require("cookie-parser")
const cors=require('cors')

// middleware used to convert the json data from request into js object and pushing into db
app.set('trust proxy', 1);
app.use(cors({
origin:"https://resocf-2.onrender.com",
credentials:true
}))
app.use(express.json())
app.use(cookieParser())
// cookie parser is used to parse the cookie sent from the browser and decipher it


// This call with check all the routes with any method in the corresponding routers and it a route
// matches it will return the response
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',connectionReqRouter)
app.use('/',userRouter)

app.get('/user',async(req,res)=>{
const userEmail=req.body?.email
try{
const user=await userModel.findOne({email:userEmail})
if(!user){
res.status(400).send("user not found")
}
else{
res.send(user)
}
}
catch(err){
console.log("oops some issue is there")
}
})

DBConnect().then(()=>{
console.log("database connection estabished")
app.listen(process.env.PORT || 7646,()=>{
console.log(`listening at port no ${process.env.PORT}`)
})
}).catch((err)=>{
console.error("Database not connected there is some error")
})
