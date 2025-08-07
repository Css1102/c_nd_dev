const twilio=require('twilio')
const Redis=require('ioredis')
const client=twilio(accountSid,authToken);
const redis=new Redis()

async function sendOTP(userId,mobileNumber){
const otp=Math.floor(100000+Math.random()*900000).toString();
await redis.set(`otp:${userId}`,otp,"EX",300);
return client.messages.create({
body:`your verification code is ${otp}`,
to:mobileNumber,
from:twilioPhoneNumber
})
}