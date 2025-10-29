// Test manual cho nutrition API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

// Hardcode một user ID để test (thay thế bằng ID thực tế từ database)
const TEST_USER_ID = '68feba1805174c4fe757baab'; // Employee ID từ file test khác

async function quickTest() {
  try {
    console.log('🧪 Quick Test Nutrition API...\n');

    // Test POST - Tạo dữ liệu dinh dưỡng mới
    console.log('1. Tạo dữ liệu dinh dưỡng mới...');
    
    const postData = {
      khachhangUserID: TEST_USER_ID,
      userID: TEST_USER_ID,
      chieucao: 175,
      cannang: 70,
    };

    const response = await axios.post(`${API_BASE_URL}/dinhduong`, postData);
    
    if (response.status === 201) {
      console.log('✅ Tạo thành công!');
      console.log('Data:', response.data);
    }

  } catch (error) {
    if (error.response) {
      console.log('❌ Lỗi:', error.response.status, error.response.data);
    } else {
      console.log('❌ Lỗi:', error.message);
    }
  }
}

quickTest();