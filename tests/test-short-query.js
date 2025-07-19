const axios = require('axios');

const messages = [
  "Saree",
  "Kurta",
  "Tracksuit",
  "Lehenga",
  "Jacket"
];

async function runShortQueryTest() {
  for (const msg of messages) {
    try {
      const res = await axios.post('http://localhost:5000/api/recommend', { message: msg });
      console.log(`\n🔍 Prompt: ${msg}`);
      console.log('📦 Result:', res.data);
    } catch (err) {
      console.error(`❌ Error for "${msg}":`, err.message);
    }
  }
}

runShortQueryTest();
