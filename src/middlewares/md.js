const adminAuth=(req,res,next)=>{
    console.log("middleware of module called")
const authToken="xysff"  
console.log("middleware is checking")
//In real scenario auth token will come inside the request and is referenced by req.body?.token
const verifyToken=authToken==="xysff"
if(verifyToken){
next()
}
else{
res.status(401).send('User of the privelege not found') //by default res.send() gives a code of 200
}
}

module.exports={adminAuth}