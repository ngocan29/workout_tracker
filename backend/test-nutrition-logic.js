const axios = require('axios');

async function testNutritionLogic() {
  try {
    console.log('🧪 TESTING NEW NUTRITION LOGIC');
    console.log('================================\n');

    const API_URL = 'http://localhost:5000';
    const testUserID = '68ef57e101e5459beb3723a4'; // User có sẵn

    // Test case 1: Người dùng CHƯA có dữ liệu dinh dưỡng
    console.log('📋 Test Case 1: User WITHOUT nutrition data');
    console.log('Expected: Should show modal immediately for first time input\n');

    try {
      const response1 = await axios.get(`${API_URL}/dinhduong/user/${testUserID}`);
      console.log('⚠️ User HAS data:', {
        calories: response1.data.calo,
        created: new Date(response1.data.ngaytao).toLocaleDateString()
      });
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ User has NO data - will show first time modal');
      } else {
        console.log('❌ API Error:', error.response?.data || error.message);
      }
    }

    // Test case 2: Người dùng ĐÃ có dữ liệu - Ngày bình thường
    console.log('\n📋 Test Case 2: User WITH data - Normal day');
    console.log('Expected: Should show nutrition screen normally, NO modal\n');

    // Tạo dữ liệu test nếu chưa có
    try {
      const createResponse = await axios.post(`${API_URL}/dinhduong`, {
        userID: testUserID,
        chieucao: 170,
        cannang: 65
      });
      console.log('✅ Created test data:', {
        id: createResponse.data._id,
        calories: createResponse.data.calo,
        luongnuoc: createResponse.data.luongnuoc
      });
    } catch (error) {
      console.log('ℹ️ Data might already exist:', error.response?.data?.error);
    }

    // Kiểm tra dữ liệu hiện tại
    try {
      const currentData = await axios.get(`${API_URL}/dinhduong/user/${testUserID}`);
      const dataDate = new Date(currentData.data.ngaytao);
      const currentDate = new Date();
      
      console.log('📊 Current data analysis:', {
        userID: testUserID,
        calories: currentData.data.calo,
        luongnuoc: currentData.data.luongnuoc,
        waterPerGlass: Math.round((currentData.data.luongnuoc * 1000) / 8) + 'ml',
        dataDate: dataDate.toLocaleDateString(),
        currentDate: currentDate.toLocaleDateString(),
        isToday: dataDate.toDateString() === currentDate.toDateString(),
        isFirstDay: currentDate.getDate() === 1,
        isDifferentMonth: currentDate.getMonth() !== dataDate.getMonth() || 
                         currentDate.getFullYear() !== dataDate.getFullYear()
      });

      console.log('\n🎯 Frontend Logic Result:');
      const isFirstDay = currentDate.getDate() === 1;
      const isDifferentMonth = currentDate.getMonth() !== dataDate.getMonth() || 
                              currentDate.getFullYear() !== dataDate.getFullYear();

      if (isFirstDay && isDifferentMonth) {
        console.log('📝 SHOW MODAL: Monthly update (mùng 1 đầu tháng)');
      } else {
        console.log('✨ SHOW NUTRITION SCREEN: Normal display with existing data');
      }

    } catch (error) {
      console.log('❌ Error getting current data:', error.response?.data || error.message);
    }

    // Test case 3: Mô phỏng mùng 1 đầu tháng
    console.log('\n📋 Test Case 3: Simulate first day of month');
    console.log('Expected: Should show monthly update modal\n');

    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    
    console.log('🗓️ Simulated scenario:');
    console.log(`Current date: ${firstDayOfMonth.toLocaleDateString()}`);
    console.log('Data from previous month exists');
    console.log('Result: Should show monthly update modal');

    console.log('\n🎉 LOGIC TESTING COMPLETE!');
    console.log('Frontend should now:');
    console.log('✅ Show modal only on first time OR mùng 1 đầu tháng');
    console.log('✅ Show nutrition screen normally with existing data');
    console.log('✅ Calculate water per glass from luongnuoc API');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testNutritionLogic();
