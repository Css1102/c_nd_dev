const express=require("express")
const app=express()

/*Route matching is handled through regex expression so the order of different route calls 
matters a lot. The route that is matched first will be displayed on the server.*/
// will match only the get call to '/test'
app.get('/test',(req,res)=>{
res.send("This is my test in the course called from get")
})
// will match post call to the /test
app.post('/test',(req,res)=>{
res.send("This is my test in the course from the post")
})

// will match all http calls to /test
app.use('/test',(req,res)=>{
res.send("This is my test in the course")
})
app.listen(7646,()=>{
console.log("listening at port no 7646")
})