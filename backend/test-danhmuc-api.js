const fetch = require('node-fetch');

async function testDanhmucAPI() {
  try {
    console.log('🧪 Testing danhmuc API endpoints...');
    
    const baseURL = 'http://localhost:5000';
    
    // Test 1: GET all categories
    console.log('\n1️⃣ Testing GET /danhmuc');
    const response1 = await fetch(`${baseURL}/danhmuc`);
    console.log('Status:', response1.status);
    if (response1.ok) {
      const data = await response1.json();
      console.log('✅ GET /danhmuc working, found', data.length, 'categories');
    } else {
      console.log('❌ GET /danhmuc failed:', response1.statusText);
    }
    
    // Test 2: GET categories by user
    console.log('\n2️⃣ Testing GET /danhmuc/user/68f8568c30bee478d7803f09');
    const response2 = await fetch(`${baseURL}/danhmuc/user/68f8568c30bee478d7803f09`);
    console.log('Status:', response2.status);
    if (response2.ok) {
      const data = await response2.json();
      console.log('✅ GET /danhmuc/user/:id working, found', data.length, 'categories');
    } else {
      console.log('❌ GET /danhmuc/user/:id failed:', response2.statusText);
    }
    
    // Test 3: GET categories by branch
    console.log('\n3️⃣ Testing GET /danhmuc/chinhanh/68f9b1e3f1d8f1ecde6c5eaa');
    const response3 = await fetch(`${baseURL}/danhmuc/chinhanh/68f9b1e3f1d8f1ecde6c5eaa`);
    console.log('Status:', response3.status);
    if (response3.ok) {
      const data = await response3.json();
      console.log('✅ GET /danhmuc/chinhanh/:id working, found', data.length, 'categories');
    } else {
      console.log('❌ GET /danhmuc/chinhanh/:id failed:', response3.statusText);
    }
    
    // Test 4: POST new category
    console.log('\n4️⃣ Testing POST /danhmuc');
    const testCategory = {
      ten: 'Test Category ' + Date.now(),
      chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa'
    };
    
    const response4 = await fetch(`${baseURL}/danhmuc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': '68f8568c30bee478d7803f09'
      },
      body: JSON.stringify(testCategory)
    });
    console.log('Status:', response4.status);
    if (response4.ok) {
      const data = await response4.json();
      console.log('✅ POST /danhmuc working, created category:', data.ten);
    } else {
      const error = await response4.text();
      console.log('❌ POST /danhmuc failed:', error);
    }
    
    console.log('\n🎉 All danhmuc API tests completed!');
    
  } catch (error) {
    console.error('❌ Error testing danhmuc API:', error);
  }
}

testDanhmucAPI();