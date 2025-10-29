// Tạo user test với giới tính để test nutrition API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function createTestUser() {
  try {
    console.log('👤 Tạo user test...');
    
    const userData = {
      email: 'nutrition@test.com',
      password: 'password123',
      hoten: 'Nutrition Test User',
      gioitinh: 'male',
      role: 'customer',
      ngaysinh: '1990-01-01'
    };

    const userResponse = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    
    if (userResponse.status === 201) {
      console.log('✅ User tạo thành công:', userResponse.data.user.email);
      return userResponse.data.user;
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error?.includes('Email already exists')) {
      console.log('👤 User đã tồn tại, tiếp tục test...');
      // Login để lấy user info
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'nutrition@test.com',
        password: 'password123'
      });
      return loginResponse.data.user;
    } else {
      console.error('❌ Lỗi tạo user:', error.response?.data || error.message);
      return null;
    }
  }
}

async function testNutritionWithUser(user) {
  try {
    console.log('\n🧪 Test Nutrition API với user có giới tính...');
    console.log(`User: ${user.email} (${user.gioitinh})\n`);

    // Test 1: POST - Tạo dữ liệu dinh dưỡng mới
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
      console.log('\n2. Lấy dữ liệu dinh dưỡng...');
      const getResponse = await axios.get(`${API_BASE_URL}/dinhduong?khachhangUserID=${user._id}`);
      
      if (getResponse.status === 200) {
        const getData = getResponse.data;
        console.log('✅ Lấy dữ liệu thành công!');
        console.log(`   - ID: ${getData._id}`);
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
          console.log(`   - Lượng nước mới: ${putData.luongnuoc} L`);
          console.log(`   - Calories mới: ${putData.calo}`);
          console.log(`   - BMI mới: ${putData.bmi}`);
          console.log(`   - LBM mới: ${putData.lbm}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Lỗi test:', error.response?.data || error.message);
  }
}

async function runFullTest() {
  const user = await createTestUser();
  if (user) {
    await testNutritionWithUser(user);
  }
  console.log('\n✅ Test hoàn thành!');
}

runFullTest();