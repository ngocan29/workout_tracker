// Script để tạo test user
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://asdsad:asdsad@workout-tracker.ocexcyq.mongodb.net/workout_tracker?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists!');
      console.log('Email: test@example.com');
      console.log('Password: 123456');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Create test user
    const testUser = new User({
      ten: 'Test User',
      loai_tai_khoan: 'business',
      email: 'test@example.com',
      sodienthoai: '0123456789',
      diachi: 'Test Address',
      ngayvao: new Date(),
      matkhau: hashedPassword,
      gioitinh: 'male',
      trangthai: 'active'
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: 123456');
    console.log('Account Type: business');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser();