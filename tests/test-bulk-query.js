// tests/test-bulk-query.js
const axios = require('axios');

const bulkQueries = [
  'Suggest some formal wear for men',
  'Show me partywear dresses',
  'What is good for summer season?',
  'Give me something ethnic for women',
  'I want a sporty outfit',
];

async function runBulkTests() {
  for (const msg of bulkQueries) {
    try {
      const res = await axios.post('http://localhost:5000/api/recommend', { message: msg });
      console.log(`\n✅ Query: "${msg}"\nResponse:`, res.data);
    } catch (err) {
      console.error(`\n❌ Failed for: "${msg}"`, err.message);
    }
  }
}

runBulkTests();


// tests/test-comprehensive.js
const axios = require('axios');

(async () => {
  try {
    // Health Check
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health:', health.data);

    // Upload Test Skipped (Requires image upload logic)

    // Get Clothes
    const clothes = await axios.get('http://localhost:5000/clothes');
    console.log('✅ Clothes fetched:', clothes.data.length);

    // Recommend
    const res = await axios.post('http://localhost:5000/api/recommend', {
      message: 'Recommend something for casual office wear'
    });
    console.log('✅ Chatbot Response:', res.data);
  } catch (err) {
    console.error('❌ Comprehensive Test Failed:', err.message);
  }
})();


// tests/test-short-query.js
const axios = require('axios');

axios.post('http://localhost:5000/api/recommend', { message: 'jeans' })
  .then(res => console.log('✅ Short query response:', res.data))
  .catch(err => console.error('❌ Short query error:', err.message));


// tests/test-query.js
const axios = require('axios');

axios.post('http://localhost:5000/api/recommend', {
  message: 'Suggest a winter outfit for women'
})
.then(res => console.log('✅ Response:', res.data))
.catch(err => console.error('❌ Error:', err.message));
