const mongoose = require('mongoose');
const User = require('./models/User');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/workout_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixCustomerAccount() {
  try {
    console.log('🔍 Checking customer account status...');
    
    // Tìm user customer@test.com
    const customer = await User.findOne({ email: 'customer@test.com' });
    
    if (!customer) {
      console.log('❌ Customer account not found');
      
      // Tạo tài khoản customer mới
      console.log('👤 Creating new customer account...');
      const newCustomer = new User({
        ten: 'Customer Test',
        loai_tai_khoan: 'personal',
        email: 'customer@test.com',
        sodienthoai: '0123456789',
        ngayvao: new Date(),
        matkhau: 'customer123',
        gioitinh: 'female',
        trangthai: 'active', // ✅ Đặt trạng thái active
        additional_info: {
          vai_tro: 'khachhang',
          ngaydangky: new Date(),
          trangthai_vai_tro: 'active'
        }
      });
      
      const savedCustomer = await newCustomer.save();
      console.log('✅ New customer created:', {
        _id: savedCustomer._id,
        ten: savedCustomer.ten,
        email: savedCustomer.email,
        trangthai: savedCustomer.trangthai
      });
      
    } else {
      console.log('👤 Found customer:', {
        _id: customer._id,
        ten: customer.ten,
        email: customer.email,
        trangthai: customer.trangthai
      });
      
      // Kiểm tra và sửa trạng thái
      if (customer.trangthai !== 'active') {
        console.log('🔧 Fixing customer account status...');
        
        await User.updateOne(
          { _id: customer._id },
          { 
            $set: { 
              trangthai: 'active',
              'additional_info.trangthai_vai_tro': 'active'
            }
          }
        );
        
        console.log('✅ Customer account activated');
      } else {
        console.log('✅ Customer account is already active');
      }
    }

    // Kiểm tra lại sau khi sửa
    const updatedCustomer = await User.findOne({ email: 'customer@test.com' });
    console.log('\n📊 Final customer status:', {
      _id: updatedCustomer._id,
      ten: updatedCustomer.ten,
      email: updatedCustomer.email,
      trangthai: updatedCustomer.trangthai,
      vai_tro: updatedCustomer.additional_info?.vai_tro,
      trangthai_vai_tro: updatedCustomer.additional_info?.trangthai_vai_tro
    });

    console.log('\n🎉 Customer account is ready for login!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixCustomerAccount();