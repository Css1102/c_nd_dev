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
const result=await fetchSkillMatches(users)
// const formatted = Object.entries(result).map(([pair, { score, match }]) => ({
//   pair,
//   score,
//   match
// }));
console.log(result)
const key = `${users.userIds[0]}-${users.userIds[1]}`;
const matchData = result[key] || { match: "Unknown", score: 0 };
res.json({
message:`the skill match is computed successfully`,
data:[{pair:key,...matchData}]
})
}
catch(err){
console.log(err.message)
}
})

module.exports={skillMatchRouter}