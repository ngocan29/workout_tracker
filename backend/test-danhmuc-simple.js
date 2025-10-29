const axios = require('axios');

async function testDanhmucEndpoints() {
  const baseURL = 'http://localhost:5000';
  
  try {
    console.log('🧪 Testing danhmuc endpoints...\n');
    
    // Test 1: GET all categories
    console.log('1️⃣ Testing GET /danhmuc');
    try {
      const response = await axios.get(`${baseURL}/danhmuc`);
      console.log('✅ Status:', response.status);
      console.log('✅ Data length:', response.data.length);
      console.log('✅ Sample data:', JSON.stringify(response.data[0] || {}, null, 2));
    } catch (error) {
      console.log('❌ Error:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('❌ Error data:', error.response.data);
      }
    }
    
    console.log('\n2️⃣ Testing GET /danhmuc/user/68f8568c30bee478d7803f09');
    try {
      const response = await axios.get(`${baseURL}/danhmuc/user/68f8568c30bee478d7803f09`);
      console.log('✅ Status:', response.status);
      console.log('✅ Data length:', response.data.length);
    } catch (error) {
      console.log('❌ Error:', error.response?.status || error.message);
    }
    
    console.log('\n3️⃣ Testing GET /danhmuc/chinhanh/68f9b1e3f1d8f1ecde6c5eaa');
    try {
      const response = await axios.get(`${baseURL}/danhmuc/chinhanh/68f9b1e3f1d8f1ecde6c5eaa`);
      console.log('✅ Status:', response.status);
      console.log('✅ Data length:', response.data.length);
    } catch (error) {
      console.log('❌ Error:', error.response?.status || error.message);
    }
    
    console.log('\n4️⃣ Testing POST /danhmuc');
    try {
      const testData = {
        ten: 'Test Category ' + Date.now()
      };
      
      const response = await axios.post(`${baseURL}/danhmuc`, testData, {
        headers: {
          'Content-Type': 'application/json',
          'user-id': '68f8568c30bee478d7803f09'
        }
      });
      console.log('✅ Status:', response.status);
      console.log('✅ Created:', response.data.ten);
    } catch (error) {
      console.log('❌ Error:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('❌ Error data:', error.response.data);
      }
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  }
}

testDanhmucEndpoints();