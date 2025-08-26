const axios=require('axios')
const {createClient}=require('redis')
const env=require('dotenv').config()
const REDIS_URL=process.env.NODE_ENV===production? process.env.REDIS_URL:'redis://localhost:6379'
const client = createClient({ url: REDIS_URL });
let redisReady = false;
async function ensureRedisConnected() {
  if (!redisReady) {
    await client.connect();
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