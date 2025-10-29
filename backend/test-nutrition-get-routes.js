const axios = require('axios');

async function testNutritionGETRoutes() {
  try {
    console.log('🧪 TESTING NUTRITION GET ROUTES');
    console.log('================================\n');

    const API_URL = 'http://localhost:5000';

    // 1. Lấy tất cả data dinh dưỡng
    console.log('1️⃣ Testing GET all nutrition data...');
    try {
      const allResponse = await axios.get(`${API_URL}/dinhduong?all=true`);
      console.log('✅ GET all successful:');
      console.log(`📊 Total records: ${allResponse.data.length}`);
      
      if (allResponse.data.length > 0) {
        console.log('📋 Sample records:');
        allResponse.data.slice(0, 3).forEach((item, index) => {
          console.log(`   ${index + 1}. User: ${item.userID}, BMI: ${item.bmi}, Date: ${new Date(item.ngaytao).toLocaleDateString()}`);
        });
      }
    } catch (error) {
      console.log('❌ GET all failed:', error.response?.data || error.message);
    }

    // 2. Lấy record mới nhất (không có params)
    console.log('\n2️⃣ Testing GET latest record...');
    try {
      const latestResponse = await axios.get(`${API_URL}/dinhduong`);
      console.log('✅ GET latest successful:');
      if (latestResponse.data) {
        console.log(`📊 Latest record: User ${latestResponse.data.userID}, BMI: ${latestResponse.data.bmi}, Date: ${new Date(latestResponse.data.ngaytao).toLocaleDateString()}`);
      } else {
        console.log('📊 No records found');
      }
    } catch (error) {
      console.log('❌ GET latest failed:', error.response?.data || error.message);
    }

    // 3. Lấy theo userID cụ thể
    console.log('\n3️⃣ Testing GET by userID...');
    try {
      // Lấy userID từ data có sẵn
      const allData = await axios.get(`${API_URL}/dinhduong?all=true`);
      if (allData.data.length > 0) {
        const testUserID = allData.data[0].userID;
        
        const userResponse = await axios.get(`${API_URL}/dinhduong?userID=${testUserID}`);
        console.log('✅ GET by userID successful:');
        if (userResponse.data) {
          console.log(`📊 User record: ${userResponse.data.userID}, BMI: ${userResponse.data.bmi}, Calories: ${userResponse.data.calo}`);
        } else {
          console.log('📊 No record found for this user');
        }
      }
    } catch (error) {
      console.log('❌ GET by userID failed:', error.response?.data || error.message);
    }

    // 4. Lấy tất cả records của một user cụ thể
    console.log('\n4️⃣ Testing GET all records by userID...');
    try {
      const allData = await axios.get(`${API_URL}/dinhduong?all=true`);
      if (allData.data.length > 0) {
        const testUserID = allData.data[0].userID;
        
        const userAllResponse = await axios.get(`${API_URL}/dinhduong?userID=${testUserID}&all=true`);
        console.log('✅ GET all by userID successful:');
        console.log(`📊 User ${testUserID} has ${userAllResponse.data.length} records`);
        
        if (userAllResponse.data.length > 0) {
          console.log('📋 User records:');
          userAllResponse.data.forEach((item, index) => {
            console.log(`   ${index + 1}. BMI: ${item.bmi}, Weight: ${item.cannang}kg, Date: ${new Date(item.ngaytao).toLocaleDateString()}`);
          });
        }
      }
    } catch (error) {
      console.log('❌ GET all by userID failed:', error.response?.data || error.message);
    }

    console.log('\n🎯 USAGE SUMMARY:');
    console.log('================');
    console.log('• GET /dinhduong                     → Latest 1 record (all users)');
    console.log('• GET /dinhduong?all=true           → All records (all users)');
    console.log('• GET /dinhduong?userID=xxx         → Latest 1 record (specific user)');
    console.log('• GET /dinhduong?userID=xxx&all=true → All records (specific user)');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testNutritionGETRoutes();