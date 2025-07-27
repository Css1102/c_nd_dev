const {Chat}=require('../model/chat')
const express=require('express')
const chatRouter=express.Router()
const {Auth}=require('../middleware/auth.js')
const {onlineUsers}=require('../utils/socket.js')
chatRouter.get('/chat/:toChatId',Auth,async(req,res)=>{
try{
const {toChatId}=req.params
const userId=req.user._id
let chat=await Chat.findOne({
participants:{$all:[userId,toChatId]}
}).populate({
path:'messages.senderId',
select:"firstName lastName"
}).exec()
if(!chat){
chat=new Chat({
participants:[userId,toChatId],
messages:[]
})
await chat.save()
}
res.json({message:"Chats retrieved",
    data:chat
})
}
catch(err){
res.status(400).send(err.message)
}
})

chatRouter.get('/status/:toChatId',Auth,async(req,res)=>{
try{
const {toChatId}=req.params
const status=onlineUsers.get(toChatId)
console.log([...onlineUsers.entries()])
  if (!status) return res.json({ online: false, lastSeen: null });

  res.json({
    online: !!status.socketId,
    lastSeen: status.lastSeen || null,
  });
}
catch(err){
res.send(err.message)
}
})
module.exports={chatRouter}