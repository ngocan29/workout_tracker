const express = require('express');
const connectDB = require('./db');

// Test đơn giản để kiểm tra danhmuc routes
async function testDanhmucRoute() {
  try {
    console.log('🔧 Testing danhmuc route...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');
    
    // Try to require danhmuc routes
    const danhmucRoutes = require('./routes/danhmuc');
    console.log('✅ Danhmuc routes loaded successfully');
    
    // Try to require model
    const Danhmuc = require('./models/DanhMuc');
    console.log('✅ DanhMuc model loaded successfully');
    
    // Create express app
    const app = express();
    
    // Mount route
    app.use('/danhmuc', danhmucRoutes);
    console.log('✅ Routes mounted successfully');
    
    console.log('🎉 All danhmuc components working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing danhmuc route:', error);
    console.error('Stack trace:', error.stack);
  }
  
  process.exit(0);
}

testDanhmucRoute();