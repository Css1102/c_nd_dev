const {fetchSkillMatches}=require('../utils/fetchMatches')
const express=require('express')
const skillMatchRouter=express.Router()
const {userModel}=require('../model/user.js')
const {Auth}=require('../middleware/auth.js')
const axios=require('axios')
const Redis=require('ioredis')

skillMatchRouter.post('/match-skills',Auth,async(req,res)=>{
try{
const users=(req.body)
console.log(users)
const result=await fetchSkillMatches(users)
console.log(result)
const formatted = Object.entries(result).map(([pair, { score, match }]) => ({
  pair,
  score,
  match
}));
res.json({
message:`the skill match between ${formatted[0]?.pair} is computed successfully`,
data:formatted
})
}
catch(err){
console.log(err.message)
}
})

module.exports={skillMatchRouter}