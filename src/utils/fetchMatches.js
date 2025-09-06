const axios = require('axios');
const { createClient } = require('redis');

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null;
const REDIS_PORT=process.env.REDIS_PORT||6379
let redisClient = null;
let redisReady = false;

// Initialize Redis safely
async function initRedis() {
  if (!REDIS_URL || redisReady) return;

  try {
    redisClient = createClient({
      username: 'default',
      ...REDIS_PASSWORD && {password:REDIS_PASSWORD},
      socket: {
        ...REDIS_URL && {host:REDIS_URL},
        ...REDIS_PORT && {port:REDIS_PORT},
        reconnectStrategy: () => 1000, // retry every second
      },
    });

    redisClient.on('error', (err) => {
      console.warn("⚠️ Redis error:", err.message);
      redisReady = false;
    });

    await redisClient.connect();
    redisReady = true;
    console.log("✅ Redis connected");
  } catch (err) {
    console.warn("❌ Redis connection failed:", err.message);
    redisReady = false;
  }
}

async function fetchSkillMatches(userIds) {
  await initRedis();

  const [userA, userB] = userIds.userIds;
  const cacheKey = `match:${userA}:${userB}`;

  // Try Redis cache
  if (redisReady) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`📦 Cache hit for ${cacheKey}`);
        return { [`${userA}-${userB}`]: JSON.parse(cached) };
      }
    } catch (err) {
      console.warn("⚠️ Redis get failed:", err.message);
    }
  }

  // Call FastAPI
  try {
    console.log("🚀 Calling FastAPI at:", `${FASTAPI_URL}/match_from_db`);
    const response = await axios.post(
      `${FASTAPI_URL}/match_from_db`,
      userIds,
      { headers: { "Content-Type": "application/json" } }
    );

    const matches = response.data;
    const matchData = matches[`${userA}-${userB}`];

    // Try to cache result
    if (redisReady && matchData) {
      try {
        await redisClient.set(cacheKey, JSON.stringify(matchData), {
          EX: 3600, // 1 hour
        });
        console.log(`✅ Cached result for ${cacheKey}`);
      } catch (err) {
        console.warn("⚠️ Redis set failed:", err.message);
      }
    }

    return matches;
  } catch (error) {
    console.error("❌ FastAPI call failed:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
    return null;
  }
}

module.exports = { fetchSkillMatches };

// const axios = require('axios');

// const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

// async function fetchSkillMatches(userIds) {
//   try {
//     console.log("🚀 Calling FastAPI at:", `${FASTAPI_URL}/match_from_db`);
//     console.log("📦 Payload:", userIds);

//     const response = await axios.post(
//       `${FASTAPI_URL}/match_from_db`,
//       userIds,
//       { headers: { "Content-Type": "application/json" } }
//     );

//     console.log("✅ FastAPI response:", response.data);
//     return response.data;

//   } catch (error) {
//     console.error("❌ Error fetching skill matches:", error.message);
//     if (error.response) {
//       console.error("Response data:", error.response.data);
//       console.error("Status code:", error.response.status);
//     }
//     return null;
//   }
// }

// module.exports = { fetchSkillMatches };
