// Test script để check API calls
const API_BASE = 'http://localhost:5000/api';

async function testAPIs() {
  console.log('=== Testing Category APIs ===');
  
  // Test 1: Get all categories (should not be used anymore)
  try {
    const response1 = await fetch(`${API_BASE}/danhmuc`);
    const data1 = await response1.json();
    console.log('❌ GET /danhmuc (all categories):', data1.length, 'categories');
  } catch (error) {
    console.error('Error testing /danhmuc:', error.message);
  }

  // Test 2: Get categories by branch
  try {
    const branchId = '68f9b1e3f1d8f1ecde6c5eaa'; // Test branch ID
    const response2 = await fetch(`${API_BASE}/danhmuc/chinhanh/${branchId}`);
    const data2 = await response2.json();
    console.log('✅ GET /danhmuc/chinhanh:', data2.length, 'categories for branch');
  } catch (error) {
    console.error('Error testing branch categories:', error.message);
  }

  // Test 3: Get categories by user
  try {
    const userId = '68feba1805174c4fe757baa8'; // Test user ID
    const response3 = await fetch(`${API_BASE}/danhmuc/user/${userId}`);
    const data3 = await response3.json();
    console.log('✅ GET /danhmuc/user:', data3.length, 'categories for user');
  } catch (error) {
    console.error('Error testing user categories:', error.message);
  }
}

testAPIs();