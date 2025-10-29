// Script để thêm chinhanhID cho business user
const mongoose = require('mongoose');
const User = require('./models/User');

async function updateBusinessUser() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://la_workout_tracker:lawt123456@workout-tracker.ocexcyq.mongodb.net/workout_tracker';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const branchId = '68f9b1e3f1d8f1ecde6c5eaa';

    // Update business user to have chinhanhID
    const businessResult = await User.updateOne(
      { email: 'la@contact.com', loai_tai_khoan: 'business' },
      {
        $set: {
          chinhanhID: branchId,
          'additional_info.chinhanhID': branchId
        }
      }
    );
    console.log('✅ Updated business user:', businessResult);

    // Check updated user
    const updatedUser = await User.findOne({ email: 'la@contact.com' });
    console.log('👤 Updated user data:');
    console.log('- chinhanhID:', updatedUser.chinhanhID);
    console.log('- additional_info.chinhanhID:', updatedUser.additional_info?.chinhanhID);

    console.log('\n🎉 Business user updated successfully!');

  } catch (error) {
    console.error('❌ Error updating business user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateBusinessUser();