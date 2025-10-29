const mongoose = require('mongoose');
const User = require('./models/User');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/workouttracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createMoreEmployees() {
  try {
    const moreEmployees = [
      {
        ten: 'Nguyễn Văn An',
        email: 'employee1@test.com',
        matkhau: '$2b$10$K8YB/8Z4H.vZ8Y4H.vZ8YeB.vZ8Y4H.vZ8Y4H.vZ8Y4H.vZ8Y4H.v',
        sodienthoai: '0912345678',
        diachi: '123 Nguyễn Huệ, Q1, HCM',
        gioitinh: 'male',
        loai_tai_khoan: 'business',
        ngayvao: new Date(),
        trangthai: 'active',
        additional_info: {
          vai_tro: 'nhanvien',
          chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa',
          chucvu: 'Huấn luyện viên',
          luong: '15000000',
          trangthai_vai_tro: 'active',
          ngaydangky: new Date().toISOString()
        }
      },
      {
        ten: 'Trần Thị Bình',
        email: 'employee2@test.com',
        matkhau: '$2b$10$K8YB/8Z4H.vZ8Y4H.vZ8YeB.vZ8Y4H.vZ8Y4H.vZ8Y4H.vZ8Y4H.v',
        sodienthoai: '0912345679',
        diachi: '456 Lê Lợi, Q1, HCM',
        gioitinh: 'female',
        loai_tai_khoan: 'business',
        ngayvao: new Date(),
        trangthai: 'active',
        additional_info: {
          vai_tro: 'nhanvien',
          chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa',
          chucvu: 'Chuyên viên dinh dưỡng',
          luong: '12000000',
          trangthai_vai_tro: 'active',
          ngaydangky: new Date().toISOString()
        }
      },
      {
        ten: 'Lê Văn Cường',
        email: 'employee3@test.com',
        matkhau: '$2b$10$K8YB/8Z4H.vZ8Y4H.vZ8YeB.vZ8Y4H.vZ8Y4H.vZ8Y4H.vZ8Y4H.v',
        sodienthoai: '0912345680',
        diachi: '789 Pasteur, Q3, HCM',
        gioitinh: 'male',
        loai_tai_khoan: 'business',
        ngayvao: new Date(),
        trangthai: 'active',
        additional_info: {
          vai_tro: 'nhanvien',
          chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa',
          chucvu: 'Lễ tân',
          luong: '8000000',
          trangthai_vai_tro: 'active',
          ngaydangky: new Date().toISOString()
        }
      }
    ];

    // Cập nhật thông tin cho nhân viên đã tồn tại
    for (const employee of moreEmployees) {
      const existingUser = await User.findOne({ email: employee.email });
      if (existingUser) {
        // Cập nhật chức vụ nếu chưa có
        if (!existingUser.additional_info.chucvu) {
          await User.findOneAndUpdate(
            { email: employee.email },
            { 
              $set: { 
                'additional_info.chucvu': employee.additional_info.chucvu,
                'additional_info.luong': employee.additional_info.luong
              } 
            }
          );
          console.log(`✅ Cập nhật chức vụ cho ${employee.ten}: ${employee.additional_info.chucvu}`);
        } else {
          console.log(`⚠️ Nhân viên đã có chức vụ: ${employee.email} - ${existingUser.additional_info.chucvu}`);
        }
      } else {
        // Tạo mới nếu chưa tồn tại
        const newEmployee = new User(employee);
        await newEmployee.save();
        console.log(`✅ Tạo nhân viên mới: ${employee.ten} (${employee.email})`);
      }
    }

    console.log('\n🎉 Hoàn thành tạo/cập nhật dữ liệu nhân viên!');
    
    // Hiển thị danh sách nhân viên
    const employees = await User.find({
      'additional_info.vai_tro': 'nhanvien',
      'additional_info.chinhanhID': '68f9b1e3f1d8f1ecde6c5eaa'
    });
    
    console.log(`\n📋 Danh sách nhân viên trong chi nhánh (${employees.length} người):`);
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.ten} - ${emp.additional_info?.chucvu || 'Chưa có chức vụ'} - ${emp.email}`);
    });

  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu:', error);
  } finally {
    mongoose.connection.close();
  }
}

createMoreEmployees();