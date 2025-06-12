const mongoose=require('mongoose')

const DBConnect=async()=>{
mongoose.connect("mongodb+srv://sethischiranjeev:rzZtuk1cSKuHSJZv@cluster0.3qzlcpf.mongodb.net/devTinder")
}

module.exports={DBConnect}