// Test API dinh dưỡng với userID mới
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

// Sử dụng user từ test trước
const TEST_USER_ID = '67200e4e1c0adb2be855ec7f'; // user thien@gmail.com

async function testNutritionWithUserID() {
  try {
    console.log('🧪 Test API Dinh Dưỡng với userID...\n');
    
    // Test 1: POST - Tạo dữ liệu dinh dưỡng mới
    console.log('1. Tạo dữ liệu dinh dưỡng mới...');
    
    const postData = {
      userID: TEST_USER_ID,
      chieucao: 175,
      cannang: 70,
    };

    const postResponse = await axios.post(`${API_BASE_URL}/dinhduong`, postData);
    
    if (postResponse.status === 201) {
      const nutritionData = postResponse.data;
      console.log('✅ Tạo thành công!');
      console.log(`   - ID: ${nutritionData._id}`);
      console.log(`   - User ID: ${nutritionData.userID}`);
      console.log(`   - Chiều cao: ${nutritionData.chieucao} cm`);
      console.log(`   - Cân nặng: ${nutritionData.cannang} kg`);
      console.log(`   - Lượng nước: ${nutritionData.luongnuoc} L`);
      console.log(`   - Calories: ${nutritionData.calo}`);
      console.log(`   - Protein: ${nutritionData.protein}g`);
      console.log(`   - Carbs: ${nutritionData.carbs}g`);
      console.log(`   - Fat: ${nutritionData.fat}g`);
      console.log(`   - BMI: ${nutritionData.bmi}`);
      console.log(`   - LBM: ${nutritionData.lbm}`);

      // Test 2: GET - Lấy dữ liệu
      console.log('\n2. Lấy dữ liệu đã tạo...');
      const getResponse = await axios.get(`${API_BASE_URL}/dinhduong?userID=${TEST_USER_ID}`);
      
      if (getResponse.status === 200) {
        const getData = getResponse.data;
        if (getData) {
          console.log('✅ GET thành công!');
          console.log(`   - ID: ${getData._id}`);
          console.log(`   - User ID: ${getData.userID}`);
          console.log(`   - Ngày tạo: ${new Date(getData.ngaytao).toLocaleString('vi-VN')}`);

          // Test 3: PUT - Cập nhật hàng tháng
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
            console.log(`   - Calories mới: ${putData.calo}`);
          }
        } else {
          console.log('❌ GET trả về null - không tìm thấy dữ liệu');
        }
      }
    }

    console.log('\n✅ Test hoàn thành!');

  } catch (error) {
    if (error.response) {
      console.error('❌ Lỗi API:', error.response.status, error.response.data);
    } else {
      console.error('❌ Lỗi:', error.message);
    }
  }
}

testNutritionWithUserID();