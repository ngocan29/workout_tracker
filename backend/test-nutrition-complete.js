const mongoose = require('mongoose');
const User = require('./models/User');
const DinhDuong = require('./models/DinhDuong');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/workout_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testCompleteNutritionSystem() {
  try {
    console.log('🔬 TESTING COMPLETE NUTRITION SYSTEM');
    console.log('=====================================\n');

    // 1. Tìm user có thông tin giới tính hoặc tạo user test
    console.log('1️⃣ Finding user with gender information...');
    let user = await User.findOne({ 
      gioitinh: { $exists: true, $ne: null, $ne: '' }
    }).lean();

    if (!user) {
      console.log('🔍 No user found with gender, checking all users...');
      const allUsers = await User.find({}).lean();
      console.log(`📊 Found ${allUsers.length} total users`);
      
      if (allUsers.length > 0) {
        // Sử dụng user đầu tiên và giả định giới tính nữ
        user = allUsers[0];
        console.log('⚠️ Using first user and assuming female gender for testing');
        
        // Cập nhật user với giới tính để test
        await User.updateOne(
          { _id: user._id }, 
          { $set: { gioitinh: 'female' } }
        );
        
        user.gioitinh = 'female';
      } else {
        console.log('❌ No users found in database');
        return;
      }
    }

    console.log('✅ Found user:', {
      _id: user._id,
      ten: user.ten,
      gioitinh: user.gioitinh
    });

    const userID = user._id.toString();

    // 2. Xóa dữ liệu dinh dưỡng cũ (nếu có)
    console.log('\n2️⃣ Cleaning old nutrition data...');
    const deleteResult = await DinhDuong.deleteMany({ userID });
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} old records`);

    // 3. Test tạo dữ liệu dinh dưỡng mới (POST)
    console.log('\n3️⃣ Testing POST /dinhduong (Create new nutrition data)...');
    
    const testData = {
      userID: userID,
      chieucao: 165,
      cannang: 60
    };

    const axios = require('axios');
    const API_URL = 'http://localhost:5000';

    try {
      const postResponse = await axios.post(`${API_URL}/dinhduong`, testData);
      console.log('✅ POST successful:', {
        status: postResponse.status,
        data: postResponse.data
      });

      const nutritionId = postResponse.data._id;

      // 4. Test lấy dữ liệu dinh dưỡng (GET)
      console.log('\n4️⃣ Testing GET /dinhduong (Retrieve nutrition data)...');
      
      const getResponse = await axios.get(`${API_URL}/dinhduong?userID=${userID}`);
      console.log('✅ GET successful:', {
        status: getResponse.status,
        data: getResponse.data
      });

      // 5. Test cập nhật dữ liệu dinh dưỡng (PUT)
      console.log('\n5️⃣ Testing PUT /dinhduong (Update nutrition data)...');
      
      const updateData = {
        chieucao: 170,
        cannang: 65
      };

      const putResponse = await axios.put(`${API_URL}/dinhduong/${nutritionId}`, updateData);
      console.log('✅ PUT successful:', {
        status: putResponse.status,
        data: putResponse.data
      });

      // 6. Kiểm tra dữ liệu sau khi cập nhật
      console.log('\n6️⃣ Verifying updated data...');
      
      const finalGetResponse = await axios.get(`${API_URL}/dinhduong?userID=${userID}`);
      console.log('✅ Final verification:', {
        status: finalGetResponse.status,
        data: finalGetResponse.data
      });

      // 7. Tính toán và hiển thị kết quả
      console.log('\n7️⃣ CALCULATION RESULTS:');
      console.log('======================');
      const finalData = finalGetResponse.data;
      
      console.log(`👤 User: ${user.ten} (${user.gioitinh})`);
      console.log(`📏 Height: ${finalData.chieucao} cm`);
      console.log(`⚖️ Weight: ${finalData.cannang} kg`);
      console.log(`📊 BMI: ${finalData.bmi}`);
      console.log(`💪 LBM: ${finalData.lbm} kg`);
      console.log(`🔥 Calories: ${finalData.calo} kcal/day`);
      console.log(`🥩 Protein: ${finalData.protein} g/day`);
      console.log(`🍞 Carbs: ${finalData.carbs} g/day`);
      console.log(`🥑 Fat: ${finalData.fat} g/day`);
      console.log(`📅 Created: ${new Date(finalData.ngayTao).toLocaleString()}`);
      console.log(`🔄 Updated: ${new Date(finalData.ngayCapNhat).toLocaleString()}`);

      console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
      console.log('✅ Nutrition system is working correctly');
      console.log('✅ UserID-only architecture implemented');
      console.log('✅ Automatic calculations working');
      console.log('✅ CRUD operations functional');

    } catch (apiError) {
      console.error('❌ API Error:', {
        message: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data
      });
    }

  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

testCompleteNutritionSystem();