// Test để kiểm tra route có hoạt động không

const API_BASE = 'http://localhost:5000';

async function testSimple() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🔍 Testing simple routes...\n');

  try {
    // Test 1: Base route
    console.log('1. Testing GET /danhmuc');
    const response1 = await fetch(`${API_BASE}/danhmuc`);
    console.log('Status:', response1.status);
    
    // Test 2: Random route
    console.log('2. Testing GET /danhmuc/random');
    const response2 = await fetch(`${API_BASE}/danhmuc/random`);
    console.log('Status:', response2.status, response2.statusText);
    
    // Test 3: Chinhanh route
    console.log('3. Testing GET /danhmuc/chinhanh');
    const response3 = await fetch(`${API_BASE}/danhmuc/chinhanh`);
    console.log('Status:', response3.status, response3.statusText);
    
    // Test 4: Chinhanh with ID
    console.log('4. Testing GET /danhmuc/chinhanh/testid');
    const response4 = await fetch(`${API_BASE}/danhmuc/chinhanh/testid`);
    console.log('Status:', response4.status, response4.statusText);
    
    if (response4.status !== 404) {
      const text = await response4.text();
      console.log('Response:', text.substring(0, 100));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSimple();