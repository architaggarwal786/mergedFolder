const axios = require('axios');

const messages = [
  "I'm looking for a summer outfit for a beach party.",
  "Can you recommend something ethnic and traditional for a wedding?",
  "Suggest winter wear for men, something warm but stylish.",
  "I want a casual kurta for daily college use.",
  "Show me partywear dresses for women.",
];

async function runComprehensiveTest() {
  for (const msg of messages) {
    try {
      const res = await axios.post('http://localhost:5000/api/recommend', { message: msg });
      console.log(`\n🧠 Prompt: ${msg}`);
      console.log('👉 Response:', res.data);
    } catch (err) {
      console.error(`❌ Error for prompt "${msg}":`, err.message);
    }
  }
}

runComprehensiveTest();
