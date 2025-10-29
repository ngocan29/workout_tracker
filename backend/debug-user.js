const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/workout_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function debugUser() {
  try {
    console.log('🔍 Debugging user data...');
    
    const users = await User.find({}).limit(3);
    
    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`, {
        _id: user._id,
        ten: user.ten,
        email: user.email,
        gioitinh: user.gioitinh,
        additional_info: user.additional_info,
        allFields: Object.keys(user.toObject())
      });
    });

    // Test tìm user bằng ID
    const testUserId = users[0]._id;
    console.log('\n🔍 Testing findById with:', testUserId);
    
    const foundUser = await User.findById(testUserId);
    console.log('✅ Found user:', {
      _id: foundUser._id,
      ten: foundUser.ten,
      gioitinh: foundUser.gioitinh,
      exists: !!foundUser
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugUser();