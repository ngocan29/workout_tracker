const mongoose = require('mongoose');
const User = require('./models/User');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/workout_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createTestUserWithGender() {
  try {
    console.log('👤 Creating test user with gender information...');

    // Tạo user test với đầy đủ thông tin
    const testUser = new User({
      ten: 'Test User Female',
      loai_tai_khoan: 'personal',
      email: 'testfemale@example.com',
      sodienthoai: '0987654321',
      ngayvao: new Date(),
      matkhau: '123456',
      gioitinh: 'female',
      additional_info: {
        vai_tro: 'khachhang',
        ngaydangky: new Date(),
        trangthai_vai_tro: 'active'
      }
    });

    const savedUser = await testUser.save();
    console.log('✅ Test user created:', {
      _id: savedUser._id,
      ten: savedUser.ten,
      email: savedUser.email,
      gioitinh: savedUser.gioitinh
    });

    return savedUser;

  } catch (error) {
    console.error('❌ Error creating test user:', error);
    return null;
  }
}

async function main() {
  const user = await createTestUserWithGender();
  mongoose.connection.close();
}

main();