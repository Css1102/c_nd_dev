const env=require('dotenv').config()
const {userModel}=require('../model/user')
const socket=require('socket.io')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const handshakeFunc=(io)=>{
io.use((socket,next)=>{
const token=socket.handshake.auth?.token
if(!token){
return next(new Error("Token not present"))
}
try{
const user=jwt.verify(token,process.env.SECRET_KEY)
    socket.user = user // attach user info to socket instance
    next()
  } catch (err) {
    return next(new Error("Authentication error: invalid token"))
  }
})
}

module.exports={handshakeFunc}