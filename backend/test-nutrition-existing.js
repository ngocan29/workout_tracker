// Test với user hiện có
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

// Sử dụng user thien@gmail.com đã có trong database
const TEST_USER_EMAIL = 'thien@gmail.com';

async function getUserByEmail(email) {
  try {
    // Không có API direct get user, nên tôi sẽ dùng hardcode ID
    // Từ test-apis.js: Lê Ngọc Thiện (thien@gmail.com)  
    const userData = {
      _id: '67200e4e1c0adb2be855ec7f', // Sẽ cần update ID này
      email: 'thien@gmail.com',
      gioitinh: 'male' // Giả sử
    };
    return userData;
  } catch (error) {
    console.error('Lỗi lấy user:', error);
    return null;
  }
}

async function testWithExistingUser() {
  try {
    console.log('🧪 Test với user hiện có...\n');
    
    const user = await getUserByEmail(TEST_USER_EMAIL);
    
    // Test tạo mới dữ liệu dinh dưỡng
    console.log('1. Tạo dữ liệu dinh dưỡng mới...');
    
    const postData = {
      khachhangUserID: user._id,
      userID: user._id,
      chieucao: 175,
      cannang: 70,
    };

    const postResponse = await axios.post(`${API_BASE_URL}/dinhduong`, postData);
    
    if (postResponse.status === 201) {
      const nutritionData = postResponse.data;
      console.log('✅ Tạo thành công!');
      console.log(`   - ID: ${nutritionData._id}`);
      console.log(`   - User ID: ${nutritionData.khachhangUserID || nutritionData.userID}`);
      console.log(`   - Chiều cao: ${nutritionData.chieucao} cm`);
      console.log(`   - Cân nặng: ${nutritionData.cannang} kg`);
      console.log(`   - Lượng nước: ${nutritionData.luongnuoc} L`);
      console.log(`   - Calories: ${nutritionData.calo}`);
      console.log(`   - Protein: ${nutritionData.protein}g`);
      console.log(`   - Carbs: ${nutritionData.carbs}g`);
      console.log(`   - Fat: ${nutritionData.fat}g`);
      console.log(`   - BMI: ${nutritionData.bmi}`);
      console.log(`   - LBM: ${nutritionData.lbm}`);

      // Test GET
      console.log('\n2. Lấy dữ liệu đã tạo...');
      const getResponse = await axios.get(`${API_BASE_URL}/dinhduong?khachhangUserID=${user._id}`);
      
      if (getResponse.status === 200) {
        const getData = getResponse.data;
        console.log('✅ GET thành công!');
        console.log(`   - ID: ${getData._id}`);
        console.log(`   - Ngày tạo: ${new Date(getData.ngaytao).toLocaleString('vi-VN')}`);

        // Test PUT - Cập nhật hàng tháng
        console.log('\n3. Cập nhật hàng tháng...');
        const putResponse = await axios.put(`${API_BASE_URL}/dinhduong/${getData._id}`, {
          chieucao: 177,
          cannang: 72,
        });

        if (putResponse.status === 200) {
          const putData = putResponse.data;
          console.log('✅ Cập nhật thành công!');
          console.log(`   - Chiều cao cũ: ${putData.chieucaothangtruoc} cm`);
          console.log(`   - Cân nặng cũ: ${putData.cannangthangtruoc} kg`);
          console.log(`   - Chiều cao mới: ${putData.chieucao} cm`);
          console.log(`   - Cân nặng mới: ${putData.cannang} kg`);
          console.log(`   - BMI mới: ${putData.bmi}`);
        }
      }
    }

  } catch (error) {
    if (error.response) {
      console.error('❌ Lỗi API:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('❌ Lỗi network:', error.request);
    } else {
      console.error('❌ Lỗi:', error.message);
    }
    console.error('Full error:', error);
  }
}

testWithExistingUser();