const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/workout_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function listAndActivateUsers() {
  try {
    console.log('📋 Listing all users...');
    
    const users = await User.find({});
    
    console.log(`📊 Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.ten} (${user.email}) - Status: ${user.trangthai}`);
    });

    // Tìm user có email gần giống customer
    const possibleCustomers = users.filter(user => 
      user.email.includes('test') || 
      user.email.includes('customer') ||
      user.ten.toLowerCase().includes('customer') ||
      user.ten.toLowerCase().includes('test')
    );

    if (possibleCustomers.length > 0) {
      console.log('\n🎯 Found possible customer accounts:');
      possibleCustomers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.ten} (${user.email}) - Status: ${user.trangthai}`);
      });

      // Activate tất cả accounts
      for (const user of possibleCustomers) {
        if (user.trangthai !== 'active') {
          await User.updateOne(
            { _id: user._id },
            { 
              $set: { 
                trangthai: 'active',
                'additional_info.trangthai_vai_tro': 'active'
              }
            }
          );
          console.log(`✅ Activated account: ${user.email}`);
        }
      }
    }

    // Nếu không tìm thấy, activate user đầu tiên
    if (users.length > 0 && possibleCustomers.length === 0) {
      console.log('\n🔧 Activating first user for testing...');
      const firstUser = users[0];
      
      await User.updateOne(
        { _id: firstUser._id },
        { 
          $set: { 
            trangthai: 'active',
            matkhau: 'customer123', // Cập nhật password để test
            'additional_info.vai_tro': 'khachhang',
            'additional_info.trangthai_vai_tro': 'active'
          }
        }
      );
      
      console.log(`✅ Updated account: ${firstUser.email} with password: customer123`);
    }

    // Hiển thị trạng thái cuối cùng
    console.log('\n📊 Final user status:');
    const finalUsers = await User.find({});
    finalUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.ten} (${user.email}) - Status: ${user.trangthai}`);
    });

    console.log('\n🎉 Ready for login testing!');
    console.log('💡 Try logging in with:');
    finalUsers.slice(0, 2).forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: customer123 (updated)`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

listAndActivateUsers();