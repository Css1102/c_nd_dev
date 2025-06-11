const express=require("express")
const app=express()
const {adminAuth}=require('./middlewares/md.js')
// Any request hitting the /admin route will pass through the middleware first to verify the token
// and then if it is authenticated only then we will move to the next route handler
// app.use('/admin',(req,res,next)=>{
// const authToken="xysff"  
// console.log("middleware is checking")
// //In real scenario auth token will come inside the request and is referenced by req.body?.token
// const verifyToken=authToken==="xysff"
// if(verifyToken){
// next()
// }
// else{
// res.status(401).send('User of the privelege not found') //by default res.send() gives a code of 200
// }
// })

app.get('/admin/getAllData',adminAuth,(req,res)=>{
res.send("Data asked by the admin sent")
})
app.get('/admin/deleteAllData',(req,res)=>{
res.send("Data asked by the admin deleted")
})

app.get('/users',(req,res)=>{
console.log(req.query)
res.send('recieved a get request of users')
}
)


app.listen(7646,()=>{
console.log("listening at port no 7646")
})