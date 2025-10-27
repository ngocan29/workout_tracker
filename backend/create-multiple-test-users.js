// Script để tạo nhiều test users cho các trường hợp khác nhau
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  try {
    // Connect to MongoDB với connection string đúng
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://la_workout_tracker:lawt123456@workout-tracker.ocexcyq.mongodb.net/workout_tracker';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Hash password cho tất cả users
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Test users cho các trường hợp khác nhau
    const testUsers = [
      // 1. Personal Account (Tài khoản cá nhân) - KHÔNG có vai_tro
      {
        ten: 'Nguyễn Văn Personal',
        loai_tai_khoan: 'personal',
        email: 'personal@test.com',
        sodienthoai: '0987654321',
        diachi: 'Hà Nội',
        ngayvao: new Date(),
        matkhau: hashedPassword,
        gioitinh: 'male',
        trangthai: 'active'
        // Không có additional_info.vai_tro -> đây là personal user
      },

      // 2. Employee Account (Nhân viên)
      {
        ten: 'Trần Thị Employee',
        loai_tai_khoan: 'personal',
        email: 'employee@test.com',
        sodienthoai: '0976543210',
        diachi: 'TP.HCM',
        ngayvao: new Date(),
        matkhau: hashedPassword,
        gioitinh: 'female',
        trangthai: 'active',
        additional_info: {
          vai_tro: 'nhanvien'
        }
      },

      // 3. Customer Account (Khách hàng)
      {
        ten: 'Lê Văn Customer',
        loai_tai_khoan: 'personal',
        email: 'customer@test.com',
        sodienthoai: '0965432109',
        diachi: 'Đà Nẵng',
        ngayvao: new Date(),
        matkhau: hashedPassword,
        gioitinh: 'male',
        trangthai: 'active',
        additional_info: {
          vai_tro: 'khachhang'
        }
      }
    ];

    // Tạo từng user
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`❌ User ${userData.email} already exists!`);
        continue;
      }

      // Create new user
      const newUser = new User(userData);
      await newUser.save();
      
      let role = 'personal';
      if (userData.additional_info?.vai_tro) {
        role = userData.additional_info.vai_tro;
      }
      console.log(`✅ Created user: ${userData.email} (${role})`);
    }

    console.log('\n🎉 All test users created successfully!');
    console.log('\n📧 TEST ACCOUNTS:');
    console.log('═══════════════════════════════════════');
    console.log('1. BUSINESS ACCOUNT:');
    console.log('   Email: test@example.com');
    console.log('   Password: 123456');
    console.log('   Role: Business/Company');
    console.log('');
    console.log('2. PERSONAL ACCOUNT:');
    console.log('   Email: personal@test.com');
    console.log('   Password: 123456');
    console.log('   Role: Personal User');
    console.log('');
    console.log('3. EMPLOYEE ACCOUNT:');
    console.log('   Email: employee@test.com');
    console.log('   Password: 123456');
    console.log('   Role: Employee');
    console.log('');
    console.log('4. CUSTOMER ACCOUNT:');
    console.log('   Email: customer@test.com');
    console.log('   Password: 123456');
    console.log('   Role: Customer');
    console.log('═══════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUsers();