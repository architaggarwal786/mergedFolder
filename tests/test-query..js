const axios = require('axios');

const testQuery = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/recommend', {
      message: 'Suggest something for winter wear'
    });

    console.log('✅ Response:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
};

testQuery();
