// Test đơn giản để kiểm tra server

const API_BASE = 'http://localhost:5000';

async function testSimple() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🔍 Testing server status...\n');

  try {
    // Test health check
    console.log('1. Testing health check');
    const healthResponse = await fetch(`${API_BASE}/`);
    console.log('Health Status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('Server message:', health.message);
    }
    
    // Test danhmuc route
    console.log('\\n2. Testing GET /danhmuc');
    const danhmucResponse = await fetch(`${API_BASE}/danhmuc`);
    console.log('Danhmuc Status:', danhmucResponse.status);
    
    // Test user route thủ công với ID
    console.log('\\n3. Testing GET /danhmuc/user/test');
    const userResponse = await fetch(`${API_BASE}/danhmuc/user/test`);
    console.log('User route Status:', userResponse.status, userResponse.statusText);
    
    if (userResponse.status !== 404) {
      const userText = await userResponse.text();
      console.log('Response:', userText.substring(0, 200));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSimple();