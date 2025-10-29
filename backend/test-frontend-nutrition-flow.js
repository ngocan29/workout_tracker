const axios = require('axios');

async function testNutritionFlow() {
  try {
    console.log('🧪 TESTING NUTRITION FRONTEND FLOW');
    console.log('=====================================\n');

    const API_URL = 'http://localhost:5000';
    
    // Test case 1: User có dữ liệu dinh dưỡng
    console.log('1️⃣ Testing user WITH nutrition data...');
    const userWithData = '68ef57e101e5459beb3723a4'; // User Nguyễn Thành Đạt
    
    try {
      const response = await axios.get(`${API_URL}/dinhduong/user/${userWithData}`);
      console.log('✅ User HAS data:', {
        userID: response.data.userID,
        chieucao: response.data.chieucao,
        cannang: response.data.cannang,
        calo: response.data.calo,
        luongnuoc: response.data.luongnuoc,
        ngaytao: response.data.ngaytao
      });
      
      // Kiểm tra logic ngày tháng
      const dataDate = new Date(response.data.ngaytao);
      const currentDate = new Date();
      const isFirstDayOfMonth = currentDate.getDate() === 1;
      const isDifferentMonth = currentDate.getMonth() !== dataDate.getMonth() || 
                             currentDate.getFullYear() !== dataDate.getFullYear();
      
      console.log('📅 Date logic check:', {
        isFirstDayOfMonth,
        isDifferentMonth,
        shouldShowModal: isFirstDayOfMonth && isDifferentMonth,
        currentDate: currentDate.toDateString(),
        dataDate: dataDate.toDateString()
      });
      
      if (isFirstDayOfMonth && isDifferentMonth) {
        console.log('📝 FRONTEND SHOULD: Show monthly update modal');
      } else {
        console.log('✨ FRONTEND SHOULD: Show nutrition screen normally (no modal)');
      }
      
    } catch (error) {
      console.log('❌ User does NOT have data:', error.response?.data || error.message);
      console.log('📝 FRONTEND SHOULD: Show first-time input modal');
    }

    // Test case 2: User không có dữ liệu
    console.log('\n2️⃣ Testing user WITHOUT nutrition data...');
    const userWithoutData = '68ef592501e5459beb3723a8'; // Business user
    
    try {
      const response = await axios.get(`${API_URL}/dinhduong/user/${userWithoutData}`);
      console.log('⚠️ Unexpected: User has data when should not have');
    } catch (error) {
      console.log('✅ Confirmed: User does NOT have data');
      console.log('📝 FRONTEND SHOULD: Show first-time input modal');
    }

    // Test case 3: Tạo dữ liệu mới để test flow
    console.log('\n3️⃣ Testing create new nutrition data...');
    const testData = {
      userID: userWithoutData,
      chieucao: 170,
      cannang: 65
    };

    try {
      const createResponse = await axios.post(`${API_URL}/dinhduong`, testData);
      console.log('✅ Created new nutrition data:', {
        userID: createResponse.data.userID,
        chieucao: createResponse.data.chieucao,
        cannang: createResponse.data.cannang,
        calo: createResponse.data.calo,
        luongnuoc: createResponse.data.luongnuoc,
        waterPerGlass: Math.round((createResponse.data.luongnuoc * 1000) / 8)
      });
      
      console.log('📝 FRONTEND SHOULD: Close modal and show nutrition screen with this data');
      
    } catch (error) {
      console.log('❌ Failed to create data:', error.response?.data || error.message);
    }

    console.log('\n🎯 FRONTEND FLOW SUMMARY:');
    console.log('========================');
    console.log('1. Call NutritionService.getNutritionData(userID)');
    console.log('2. If SUCCESS + not first day of month -> Show nutrition screen');
    console.log('3. If SUCCESS + first day of month + different month -> Show update modal');
    console.log('4. If ERROR 404 -> Show first-time input modal');
    console.log('5. After successful save -> Close modal, reload data, show nutrition screen');

  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

testNutritionFlow();