const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Sử dụng MongoDB URI từ file .env
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://la_workout_tracker:lawt123456@workout-tracker.ocexcyq.mongodb.net/workout_tracker';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully to workout_tracker database');
    console.log('Connected to:', mongoURI.replace(/\/\/.*:.*@/, '//***:***@')); // Log URI với password được ẩn
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Failed URI:', process.env.MONGODB_URI ? 'From .env file' : 'Using fallback URI');
    process.exit(1);
  }
};

module.exports = connectDB;