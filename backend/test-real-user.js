const axios = require('axios');

async function testWithRealUserID() {
  try {
    console.log('🧪 TESTING WITH REAL USER ID');
    console.log('=============================\n');

    const API_URL = 'http://localhost:5000';
    const realUserID = '68ef57e101e5459beb3723a4'; // From debug script
    
    console.log('1️⃣ Testing API with real user ID...');
    console.log('User ID:', realUserID);
    
    try {
      const response = await axios.get(`${API_URL}/dinhduong/user/${realUserID}`);
      console.log('✅ SUCCESS! User has nutrition data:', {
        userID: response.data.userID,
        chieucao: response.data.chieucao,
        cannang: response.data.cannang,
        calo: response.data.calo,
        luongnuoc: response.data.luongnuoc,
        waterPerGlass: Math.round((response.data.luongnuoc * 1000) / 8),
        ngaytao: response.data.ngaytao
      });
      
      console.log('\n🎯 FRONTEND LOGIC:');
      console.log('Frontend should show nutrition screen with this data');
      console.log('Modal should only appear on first day of month if different month');
      
    } catch (error) {
      console.log('❌ API Error:', error.response?.data || error.message);
      console.log('🔍 Debugging...');
      
      // Test lấy tất cả users để debug
      try {
        const usersResponse = await axios.get(`${API_URL}/users`);
        console.log('📋 Available users:', usersResponse.data.length);
        if (usersResponse.data.length > 0) {
          const firstUser = usersResponse.data[0];
          console.log('First user:', {
            _id: firstUser._id,
            ten: firstUser.ten,
            email: firstUser.email
          });
          
          // Test với user đầu tiên
          console.log('\n2️⃣ Testing with first available user...');
          try {
            const testResponse = await axios.get(`${API_URL}/dinhduong/user/${firstUser._id}`);
            console.log('✅ SUCCESS with first user!', testResponse.data);
          } catch (testError) {
            console.log('❌ Still failed with first user:', testError.response?.data);
          }
        }
      } catch (usersError) {
        console.log('❌ Could not fetch users:', usersError.message);
      }
    }

  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

testWithRealUserID();