const axios=require('axios')
const {createClient}=require('redis')
const env=require('dotenv').config()
let client=null
if(process.env.NODE_ENV==='development'){
 client=createClient({
username:'default',
password:process.env.REDIS_PASSWORD,
socket:{
host:process.env.REDIS_URL,
port:process.env.REDIS_PORT
}
})
}
else{
client = createClient({ url: 'redis://localhost:6379' });
}
let redisReady = false;
async function ensureRedisConnected() {
  if (!redisReady) {
    if(client){
    await client.connect()
    }
    redisReady = true;
  }
}
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";
async function fetchSkillMatches(userIds) {
  await ensureRedisConnected()
   const [userA, userB] = userIds.userIds;
  const cacheKey = `match:${userA}:${userB}`;

  // 🔍 Check Redis cache
  const cached = await client.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for ${cacheKey}`);
    return { [`${userA}-${userB}`]: JSON.parse(cached) };
  }
  try {
    console.log(userIds)
    const response = await axios.post(`${FASTAPI_URL}/match_from_db`, userIds, {
      headers: { "Content-Type": "application/json" },
    });
      console.log("FastAPI response:", response.data);
        const matches = response.data;
    const matchData = matches[`${userA}-${userB}`];

    await client.set(cacheKey, JSON.stringify(matchData), 'EX', 3600);
    // Object.entries(matches).forEach(([pair, data]) => {
    //   console.log(`${pair}: ${data.match} match (${data.score})`);
    // });

    return matches;
  } catch (error) {
    console.error("Error fetching skill matches:", error.message);
    return null;
  }
}

module.exports = {fetchSkillMatches};