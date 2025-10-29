const mongoose = require('mongoose');
const User = require('./models/User');
const DinhDuong = require('./models/DinhDuong');

mongoose.connect('mongodb://localhost:27017/workout_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugAndCreateTestData() {
  try {
    console.log('🔍 Finding real users in database...');
    
    const users = await User.find({}).limit(3);
    console.log(`Found ${users.length} users:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id} | Name: ${user.ten} | Email: ${user.email}`);
    });

    if (users.length === 0) {
      console.log('❌ No users found in database!');
      return;
    }

    const testUser = users[0];
    console.log(`\n🎯 Using test user: ${testUser.ten} (${testUser._id})`);

    // Kiểm tra user này có dữ liệu dinh dưỡng chưa
    const existingData = await DinhDuong.findOne({ userID: testUser._id });
    
    if (existingData) {
      console.log('✅ User already has nutrition data:', {
        chieucao: existingData.chieucao,
        cannang: existingData.cannang,
        calo: existingData.calo,
        luongnuoc: existingData.luongnuoc,
        ngaytao: existingData.ngaytao
      });
      console.log('📝 FRONTEND SHOULD: Show nutrition screen normally (unless first day of month)');
    } else {
      console.log('❌ User does NOT have nutrition data');
      console.log('📝 FRONTEND SHOULD: Show first-time input modal');
      
      // Tạo dữ liệu test
      console.log('\n🌱 Creating test nutrition data...');
      const testData = new DinhDuong({
        userID: testUser._id,
        chieucao: 165,
        cannang: 60,
        luongnuoc: 3.45,
        calo: 2200,
        protein: 138,
        carbs: 248,
        fat: 73,
        bmi: 22.0,
        lbm: 48.5,
        ngaytao: new Date()
      });
      
      const savedData = await testData.save();
      console.log('✅ Created test nutrition data:', savedData._id);
    }

    // Tạo test case cho frontend
    console.log('\n🧪 FRONTEND TEST CASES:');
    console.log('=====================');
    console.log(`1. Login with: dat@example.com / customer123`);
    console.log(`2. User ID for API: ${testUser._id}`);
    console.log(`3. Expected: ${existingData ? 'Nutrition screen' : 'Input modal'}`);
    console.log(`4. API endpoint: GET /dinhduong/user/${testUser._id}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugAndCreateTestData();