// Test trực tiếp để kiểm tra code có được update chưa

const API_BASE = 'http://localhost:5000';

async function testCurrentServer() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🔍 Testing current server status...\n');

  try {
    // Test POST để xem debug log có xuất hiện không
    console.log('1. Testing POST với debug log');
    const postData = {
      ten: 'Server Update Test ' + Date.now(),
      chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa' // Dùng ID thật từ DB
    };
    
    console.log('Sending:', postData);
    
    const postResponse = await fetch(`${API_BASE}/danhmuc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    console.log('Status:', postResponse.status);
    const result = await postResponse.json();
    console.log('Result:', result);
    console.log('');

    // Test tất cả routes có sẵn
    console.log('2. Testing existing routes');
    const getResponse = await fetch(`${API_BASE}/danhmuc`);
    console.log('GET /danhmuc status:', getResponse.status);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCurrentServer();