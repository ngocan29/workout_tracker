// Simple test script for nutrition API using axios
const axios = require('axios');
const { MongoClient } = require('mongodb');

const API_BASE_URL = 'http://localhost:5000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/workout_tracker';

async function testNutritionAPI() {
  try {
    console.log('🧪 Bắt đầu test API Dinh Dưỡng...\n');

    // Tìm một user để test bằng cách kết nối trực tiếp MongoDB
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('workout_tracker');
    
    const user = await db.collection('users').findOne({ 
      role: 'customer',
      gioitinh: { $exists: true }
    });
    
    if (!user) {
      console.log('❌ Không tìm thấy user có giới tính để test');
      // Tạo user test
      const testUser = {
        email: 'test@nutrition.com',
        password: 'password123',
        role: 'customer',
        gioitinh: 'male',
        hoten: 'Test User',
        ngaysinh: new Date('1990-01-01'),
        chinhanhID: null
      };
      
      const insertResult = await db.collection('users').insertOne(testUser);
      testUser._id = insertResult.insertedId;
      console.log(`✅ Tạo user test: ${testUser.email} (${testUser.gioitinh})`);
      
      await testWithUser(testUser);
    } else {
      console.log(`✅ Tìm thấy user test: ${user.email} (${user.gioitinh})`);
      await testWithUser(user);
    }
    
    await client.close();
    console.log('\n✅ Test hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi test:', error);
  }
}

async function testWithUser(user) {
  try {
    // Test 1: POST - Tạo mới dữ liệu dinh dưỡng
    console.log('\n1. Test POST - Tạo mới dữ liệu dinh dưỡng...');
    const postResponse = await axios.post(`${API_BASE_URL}/api/dinhduong`, {
      khachhangUserID: user._id,
      userID: user._id,
      chieucao: 170,
      cannang: 65,
    });

    if (postResponse.status === 201) {
      const postData = postResponse.data;
      console.log('✅ Tạo mới thành công:');
      console.log(`   - Chiều cao: ${postData.chieucao} cm`);
      console.log(`   - Cân nặng: ${postData.cannang} kg`);
      console.log(`   - Lượng nước: ${postData.luongnuoc} L`);
      console.log(`   - Calories: ${postData.calo}`);
      console.log(`   - Protein: ${postData.protein}g`);
      console.log(`   - Carbs: ${postData.carbs}g`);
      console.log(`   - Fat: ${postData.fat}g`);
      console.log(`   - BMI: ${postData.bmi}`);
      console.log(`   - LBM: ${postData.lbm}`);
      
      // Test 2: GET - Lấy dữ liệu
      console.log('\n2. Test GET - Lấy dữ liệu dinh dưỡng...');
      const getResponse = await axios.get(`${API_BASE_URL}/api/dinhduong?khachhangUserID=${user._id}`);
      
      if (getResponse.status === 200) {
        const getData = getResponse.data;
        console.log('✅ Lấy dữ liệu thành công:');
        console.log(`   - ID: ${getData._id}`);
        console.log(`   - Ngày tạo: ${new Date(getData.ngaytao).toLocaleDateString('vi-VN')}`);
        
        // Test 3: PUT - Cập nhật hàng tháng
        console.log('\n3. Test PUT - Cập nhật hàng tháng...');
        const putResponse = await axios.put(`${API_BASE_URL}/api/dinhduong/${getData._id}`, {
          chieucao: 172,
          cannang: 68,
        });

        if (putResponse.status === 200) {
          const putData = putResponse.data;
          console.log('✅ Cập nhật thành công:');
          console.log(`   - Chiều cao cũ lưu vào: ${putData.chieucaothangtruoc} cm`);
          console.log(`   - Cân nặng cũ lưu vào: ${putData.cannangthangtruoc} kg`);
          console.log(`   - Chiều cao mới: ${putData.chieucao} cm`);
          console.log(`   - Cân nặng mới: ${putData.cannang} kg`);
          console.log(`   - Lượng nước mới: ${putData.luongnuoc} L`);
          console.log(`   - Calories mới: ${putData.calo}`);
          console.log(`   - BMI mới: ${putData.bmi}`);
        } else {
          console.log('❌ Lỗi PUT:', putResponse.data);
        }
      } else {
        console.log('❌ Lỗi GET:', getResponse.data);
      }
    } else {
      console.log('❌ Lỗi POST:', postResponse.data);
    }
  } catch (error) {
    console.error('❌ Lỗi trong test:', error.response?.data || error.message);
  }
}

testNutritionAPI();