const express=require("express")
const app=express()

/*Route matching is handled through regex expression so the order of different route calls 
matters a lot. The route that is matched first will be displayed on the server.*/
// will match only the get call to '/test'

app.use('/trial',(req,res,next)=>{
console.log("response 1")
// If we do not send any response here the API call will get stuck in infinite loop
next()
res.send("1st trail completed")
},(req,res,next)=>{
console.log("response 2")
next()
res.send("2nd trail completed")
},(req,res,next)=>{
console.log("response 3")
res.send("3rd trail completed")
})
// ${req.params[password]}
// In this request we have made a dynamic route which matches the request with given id password and 
// name and it is stored in the req.params as an object and can be referenced from there
app.get('/user/:userId/:password/:name',(req,res)=>{
console.log(req.params)
res.send(`recieved a get request of user with id ${req.params?.userId}  and password ${req.params?.password}`)
}
)
// in this request if an optional parameter is passed it is stored in req.query as an object and can be
// consoled from there.
app.get('/users',(req,res)=>{
console.log(req.query)
res.send('recieved a get request of users')
}
)

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