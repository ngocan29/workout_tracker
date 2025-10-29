const { MongoClient } = require('mongodb');

const API_BASE_URL = 'http://localhost:5000';
const MONGO_URI = 'mongodb://localhost:27017/workout_tracker';

async function testNutritionAPI() {
  try {
    console.log('🧪 Bắt đầu test API Dinh Dưỡng...\n');

    // Tìm một user để test
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('workout_tracker');
    
    const user = await db.collection('users').findOne({ 
      role: 'customer',
      gioitinh: { $exists: true }
    });
    
    if (!user) {
      console.log('❌ Không tìm thấy user có giới tính để test');
      return;
    }
    
    console.log(`✅ Tìm thấy user test: ${user.email} (${user.gioitinh})`);
    
    // Test 1: POST - Tạo mới dữ liệu dinh dưỡng
    console.log('\n1. Test POST - Tạo mới dữ liệu dinh dưỡng...');
    const postResponse = await fetch(`${API_BASE_URL}/api/dinhduong`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        khachhangUserID: user._id,
        userID: user._id,
        chieucao: 170,
        cannang: 65,
      }),
    });

    if (postResponse.ok) {
      const postData = await postResponse.json();
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
      const getResponse = await fetch(`${API_BASE_URL}/api/dinhduong?khachhangUserID=${user._id}`);
      
      if (getResponse.ok) {
        const getData = await getResponse.json();
        console.log('✅ Lấy dữ liệu thành công:');
        console.log(`   - ID: ${getData._id}`);
        console.log(`   - Ngày tạo: ${new Date(getData.ngaytao).toLocaleDateString('vi-VN')}`);
        
        // Test 3: PUT - Cập nhật hàng tháng
        console.log('\n3. Test PUT - Cập nhật hàng tháng...');
        const putResponse = await fetch(`${API_BASE_URL}/api/dinhduong/${getData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chieucao: 172,
            cannang: 68,
          }),
        });

        if (putResponse.ok) {
          const putData = await putResponse.json();
          console.log('✅ Cập nhật thành công:');
          console.log(`   - Chiều cao cũ lưu vào: ${putData.chieucaothangtruoc} cm`);
          console.log(`   - Cân nặng cũ lưu vào: ${putData.cannangthangtruoc} kg`);
          console.log(`   - Chiều cao mới: ${putData.chieucao} cm`);
          console.log(`   - Cân nặng mới: ${putData.cannang} kg`);
          console.log(`   - Lượng nước mới: ${putData.luongnuoc} L`);
          console.log(`   - Calories mới: ${putData.calo}`);
          console.log(`   - BMI mới: ${putData.bmi}`);
        } else {
          const putError = await putResponse.text();
          console.log('❌ Lỗi PUT:', putError);
        }
      } else {
        const getError = await getResponse.text();
        console.log('❌ Lỗi GET:', getError);
      }
    } else {
      const postError = await postResponse.text();
      console.log('❌ Lỗi POST:', postError);
    }

    await client.close();
    console.log('\n✅ Test hoàn thành!');

  } catch (error) {
    console.error('❌ Lỗi test:', error);
  }
}

testNutritionAPI();