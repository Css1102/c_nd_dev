const axios=require('axios')
const env=require('dotenv').config()
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";
async function fetchSkillMatches(userIds) {
  try {
    console.log(userIds)
    const response = await axios.post(`${FASTAPI_URL}/match_from_db`, userIds, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.data)
    // Extract and format results
    const matches = response.data;
    Object.entries(matches).forEach(([pair, data]) => {
      console.log(`${pair}: ${data.match} match (${data.score})`);
    });

    return matches;
  } catch (error) {
    console.error("Error fetching skill matches:", error.message);
    return null;
  }
}

module.exports = {fetchSkillMatches};