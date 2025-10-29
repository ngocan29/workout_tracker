const axios = require('axios');

async function simpleAPITest() {
  try {
    console.log('🌐 Testing API endpoints...');
    
    // Test server health
    console.log('\n1️⃣ Testing server health...');
    try {
      const healthResponse = await axios.get('http://localhost:5000');
      console.log('✅ Server responding:', healthResponse.status);
    } catch (error) {
      console.log('❌ Server not responding:', error.message);
    }

    // Test user endpoint
    console.log('\n2️⃣ Testing user endpoint...');
    try {
      const usersResponse = await axios.get('http://localhost:5000/users');
      console.log('✅ Users endpoint:', usersResponse.status, 'Count:', usersResponse.data.length);
      
      if (usersResponse.data.length > 0) {
        const firstUser = usersResponse.data[0];
        console.log('👤 First user:', {
          _id: firstUser._id,
          ten: firstUser.ten,
          gioitinh: firstUser.gioitinh
        });

        // Test với user ID thực
        console.log('\n3️⃣ Testing nutrition POST with real user...');
        const testData = {
          userID: firstUser._id,
          chieucao: 165,
          cannang: 60
        };

        const postResponse = await axios.post('http://localhost:5000/dinhduong', testData);
        console.log('✅ POST successful:', postResponse.data);

        // Test GET
        console.log('\n4️⃣ Testing nutrition GET...');
        const getResponse = await axios.get(`http://localhost:5000/dinhduong?userID=${firstUser._id}`);
        console.log('✅ GET successful:', getResponse.data);
      }
      
    } catch (error) {
      console.log('❌ Users endpoint error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

simpleAPITest();