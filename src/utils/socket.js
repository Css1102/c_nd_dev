const socket=require('socket.io')
const {handshakeFunc}=require('./handshake.js')
const cors=require('cors')
const crypto=require('crypto')
const {userModel}=require('../model/user')
const {Chat}=require('../model/chat')
const createRoomIdHash=(userId,toChatId)=>{
const hash=crypto.createHash('sha256').update([userId,toChatId].sort().join("_")).digest('hex')
}
const onlineUsers=new Map()
const allowedOrigins=[
"https://resocf-2.onrender.com/",
"http://localhost:5173"
]

const initialiseSocket=(server)=>{
const io=socket(server,{
cors:{
origin:(origin,callback)=>{
if(!origin || allowedOrigins.includes(origin)){
 callback(null,true)
}
else{
callback(new Error('Not allowed by CORS'));
}
},
credentials:true
}
})
handshakeFunc(io)
io.on("connection",(socket)=>{
const userId=socket.user._id
console.log(userId)
onlineUsers.set(userId,{socketId:socket.id,lastSeen:null})
socket.on("joinChat",({userId,toChatId})=>{
    // each room created needs to hame a unique Id
const roomId=createRoomIdHash(userId,toChatId)
socket.join(roomId)
})
socket.on("activeInChat", ({ userId }) => {
  // Update onlineUsers if needed
  onlineUsers.set(userId, {
    socketId: socket.id,
    lastSeen: null
  });
      io.emit("userStatusChanged", {
      userId,
      isOnline: true,
      lastSeen: null,
    });
})
socket.on("sendMessage",async({firstName,lastName,userId,toChatId,newMessage})=>{
try{
const roomId=createRoomIdHash(userId,toChatId)
console.log(newMessage)
let chat=await Chat.findOne({
participants:{$all:[userId,toChatId]},
});
if(!chat){
chat=new Chat({
participants:[userId,toChatId],
messages:[]
})
}

chat.messages.push({senderId:userId,text:newMessage})
await chat.save()
io.to(roomId).emit('messageReceived',{firstName,lastName,newMessage,senderId:userId})
}
catch(err){
console.error(err.message)
}
})
socket.on("disconnect",()=>{
onlineUsers.set(userId,{socketId:null,lastSeen:new Date().toISOString()})
    io.emit("userStatusChanged", {
      userId,
      isOnline: false,
      lastSeen: onlineUsers.get(userId).lastSeen,
    });
})
})
}


module.exports={initialiseSocket,onlineUsers}