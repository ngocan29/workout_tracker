const axios = require('axios');

async function testLoginFlow() {
  try {
    console.log('🔐 TESTING LOGIN AND NUTRITION FLOW');
    console.log('==================================\n');

    const API_URL = 'http://localhost:5000';
    
    // Test login với tài khoản đã activate
    console.log('1️⃣ Testing login...');
    const loginData = {
      email: 'dat@example.com',
      password: 'customer123'
    };

    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData);
      console.log('✅ Login successful!');
      console.log('User:', {
        _id: loginResponse.data.user._id,
        ten: loginResponse.data.user.ten,
        email: loginResponse.data.user.email,
        loai_tai_khoan: loginResponse.data.user.loai_tai_khoan
      });

      const userID = loginResponse.data.user._id;

      // Test nutrition API với user này
      console.log('\n2️⃣ Testing nutrition data for logged in user...');
      try {
        const nutritionResponse = await axios.get(`${API_URL}/dinhduong/user/${userID}`);
        console.log('✅ User HAS nutrition data:', {
          chieucao: nutritionResponse.data.chieucao,
          cannang: nutritionResponse.data.cannang,
          calo: nutritionResponse.data.calo,
          luongnuoc: nutritionResponse.data.luongnuoc,
          waterPerGlass: Math.round((nutritionResponse.data.luongnuoc * 1000) / 8),
          ngaytao: nutritionResponse.data.ngaytao
        });

        console.log('\n🎯 FRONTEND SHOULD:');
        console.log('- Show nutrition screen with this data');
        console.log('- Only show modal on first day of month if different month');

      } catch (nutritionError) {
        console.log('❌ User does NOT have nutrition data');
        console.log('Error:', nutritionError.response?.data);
        console.log('\n🎯 FRONTEND SHOULD:');
        console.log('- Show first-time input modal');

        // Test tạo dữ liệu mới
        console.log('\n3️⃣ Testing create nutrition data...');
        const testNutritionData = {
          userID: userID,
          chieucao: 170,
          cannang: 65
        };

        try {
          const createResponse = await axios.post(`${API_URL}/dinhduong`, testNutritionData);
          console.log('✅ Created nutrition data successfully:', {
            chieucao: createResponse.data.chieucao,
            cannang: createResponse.data.cannang,
            calo: createResponse.data.calo,
            luongnuoc: createResponse.data.luongnuoc,
            waterPerGlass: Math.round((createResponse.data.luongnuoc * 1000) / 8)
          });
          console.log('🎯 FRONTEND SHOULD: Close modal and show nutrition screen');
        } catch (createError) {
          console.log('❌ Failed to create nutrition data:', createError.response?.data);
        }
      }

    } catch (loginError) {
      console.log('❌ Login failed:', loginError.response?.data || loginError.message);
    }

  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

testLoginFlow();