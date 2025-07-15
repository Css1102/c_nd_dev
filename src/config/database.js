const mongoose=require('mongoose')
const env=require('dotenv').config()
const DBConnect=async()=>{
mongoose.connect(process.env.MONGOSE_URI)
}

module.exports={DBConnect}