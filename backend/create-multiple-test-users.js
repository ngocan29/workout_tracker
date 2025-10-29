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
          vai_tro: 'nhanvien',
          chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa',
          ngaybatdau: new Date(),
          trangthai_vai_tro: 'active'
        }
      },

      // 3. Customer Account (Khách hàng được phân công cho nhân viên)
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
          vai_tro: 'khachhang',
          chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa',
          nhanvienUserID: null, // Sẽ được cập nhật sau khi tạo employee
          ngaydangky: new Date(),
          trangthai_vai_tro: 'active'
        }
      },

      // 4. Customer Account thứ 2 (không được phân công)
      {
        ten: 'Phạm Thị Customer2',
        loai_tai_khoan: 'personal',
        email: 'customer2@test.com',
        sodienthoai: '0954321098',
        diachi: 'Hải Phòng',
        ngayvao: new Date(),
        matkhau: hashedPassword,
        gioitinh: 'female',
        trangthai: 'active',
        additional_info: {
          vai_tro: 'khachhang',
          chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa',
          nhanvienUserID: null, // Không được phân công
          ngaydangky: new Date(),
          trangthai_vai_tro: 'active'
        }
      }
    ];

    // Tạo từng user
    let employeeId = null;
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`❌ User ${userData.email} already exists!`);
        // Nếu là employee, lưu ID để assign customer
        if (userData.additional_info?.vai_tro === 'nhanvien') {
          employeeId = existingUser._id;
        }
        continue;
      }

      // Create new user
      const newUser = new User(userData);
      await newUser.save();
      
      // Nếu là employee, lưu ID để assign customer
      if (userData.additional_info?.vai_tro === 'nhanvien') {
        employeeId = newUser._id;
      }
      
      let role = 'personal';
      if (userData.additional_info?.vai_tro) {
        role = userData.additional_info.vai_tro;
      }
      console.log(`✅ Created user: ${userData.email} (${role})`);
    }

    // Assign customer đầu tiên cho employee (nếu có)
    if (employeeId) {
      const customerToAssign = await User.findOne({ 
        email: 'customer@test.com',
        'additional_info.vai_tro': 'khachhang'
      });
      
      if (customerToAssign) {
        customerToAssign.additional_info.nhanvienUserID = employeeId;
        await customerToAssign.save();
        console.log(`✅ Assigned customer ${customerToAssign.email} to employee ${employeeId}`);
      }
    }

    console.log('\n🎉 All test users created successfully!');
    console.log('\n📧 TEST ACCOUNTS (Chi nhánh: 68f9b1e3f1d8f1ecde6c5eaa):');
    console.log('═══════════════════════════════════════');
    console.log('1. BUSINESS ACCOUNT:');
    console.log('   Email: test@example.com');
    console.log('   Password: 123456');
    console.log('   Role: Business/Company');
    console.log('');
    console.log('2. PERSONAL ACCOUNT:');
    console.log('   Email: personal@test.com');
    console.log('   Password: 123456');
    console.log('   Role: Personal User (không thuộc chi nhánh)');
    console.log('');
    console.log('3. EMPLOYEE ACCOUNT:');
    console.log('   Email: employee@test.com');
    console.log('   Password: 123456');
    console.log('   Role: Employee (thuộc chi nhánh 68f9b1e3f1d8f1ecde6c5eaa)');
    console.log('');
    console.log('4. CUSTOMER ACCOUNT (được phân công):');
    console.log('   Email: customer@test.com');
    console.log('   Password: 123456');
    console.log('   Role: Customer (thuộc chi nhánh, có nhân viên phụ trách)');
    console.log('');
    console.log('5. CUSTOMER ACCOUNT (không được phân công):');
    console.log('   Email: customer2@test.com');
    console.log('   Password: 123456');
    console.log('   Role: Customer (thuộc chi nhánh, chưa có nhân viên phụ trách)');
    console.log('═══════════════════════════════════════');
    console.log('\n🔍 TEST SCENARIOS:');
    console.log('- Business: Sẽ thấy tất cả khách hàng trong chi nhánh (customer@test.com + customer2@test.com)');
    console.log('- Employee: Chỉ thấy khách hàng được phân công (customer@test.com)');
    console.log('- Personal: Không thấy gì (không thuộc chi nhánh)');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUsers();