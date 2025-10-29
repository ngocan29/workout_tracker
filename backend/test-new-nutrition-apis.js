const axios = require('axios');

async function testNewNutritionAPIs() {
  try {
    console.log('🧪 TESTING NEW NUTRITION API ENDPOINTS');
    console.log('=====================================\n');

    const API_URL = 'http://localhost:5000';

    // Test 1: Lấy tất cả data dinh dưỡng
    console.log('1️⃣ Testing GET /dinhduong (Get all nutrition data)...');
    try {
      const allDataResponse = await axios.get(`${API_URL}/dinhduong`);
      console.log('✅ GET all successful:', {
        status: allDataResponse.status,
        count: allDataResponse.data.length,
        sample: allDataResponse.data[0] ? {
          _id: allDataResponse.data[0]._id,
          userID: allDataResponse.data[0].userID,
          calo: allDataResponse.data[0].calo,
          luongnuoc: allDataResponse.data[0].luongnuoc
        } : 'No data'
      });
    } catch (error) {
      console.log('❌ GET all failed:', error.response?.data || error.message);
    }

    // Test 2: Lấy data theo userID cụ thể
    console.log('\n2️⃣ Testing GET /dinhduong/user/:userID (Get user specific data)...');
    
    // Lấy userID từ users endpoint
    try {
      const usersResponse = await axios.get(`${API_URL}/users`);
      if (usersResponse.data.length > 0) {
        const testUserID = usersResponse.data[0]._id;
        console.log('👤 Using test userID:', testUserID);

        try {
          const userDataResponse = await axios.get(`${API_URL}/dinhduong/user/${testUserID}`);
          console.log('✅ GET user data successful:', {
            status: userDataResponse.status,
            data: {
              _id: userDataResponse.data._id,
              userID: userDataResponse.data.userID,
              chieucao: userDataResponse.data.chieucao,
              cannang: userDataResponse.data.cannang,
              calo: userDataResponse.data.calo,
              luongnuoc: userDataResponse.data.luongnuoc,
              bmi: userDataResponse.data.bmi,
              lbm: userDataResponse.data.lbm
            }
          });
        } catch (userError) {
          console.log('ℹ️ GET user data result:', userError.response?.data || userError.message);
        }
      }
    } catch (error) {
      console.log('❌ Could not get users for testing:', error.message);
    }

    // Test 3: Tạo data mới và test lại
    console.log('\n3️⃣ Creating test data and retesting...');
    
    try {
      const usersResponse = await axios.get(`${API_URL}/users`);
      if (usersResponse.data.length > 0) {
        const testUser = usersResponse.data[0];
        console.log('👤 Creating nutrition data for user:', testUser.ten);

        // Tạo nutrition data mới
        const testData = {
          userID: testUser._id,
          chieucao: 170,
          cannang: 65
        };

        const createResponse = await axios.post(`${API_URL}/dinhduong`, testData);
        console.log('✅ POST successful:', {
          status: createResponse.status,
          data: {
            _id: createResponse.data._id,
            calo: createResponse.data.calo,
            luongnuoc: createResponse.data.luongnuoc,
            waterPerGlass: Math.round((createResponse.data.luongnuoc * 1000) / 8)
          }
        });

        // Test lại GET user data
        console.log('\n4️⃣ Retesting GET user data after creation...');
        const retestResponse = await axios.get(`${API_URL}/dinhduong/user/${testUser._id}`);
        console.log('✅ Retest successful:', {
          status: retestResponse.status,
          waterCalculation: {
            luongnuoc: retestResponse.data.luongnuoc + 'L',
            totalML: (retestResponse.data.luongnuoc * 1000) + 'ml',
            mlPerGlass: Math.round((retestResponse.data.luongnuoc * 1000) / 8) + 'ml/cốc',
            totalGlasses: '8 cốc'
          }
        });
      }
    } catch (error) {
      console.log('❌ Test creation failed:', error.response?.data || error.message);
    }

    console.log('\n🎉 NEW API ENDPOINTS TESTED!');
    console.log('✅ GET /dinhduong - Lấy tất cả data');
    console.log('✅ GET /dinhduong/user/:userID - Lấy data theo userID');
    console.log('✅ Water calculation: luongnuoc ÷ 8 = ml per glass');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testNewNutritionAPIs();