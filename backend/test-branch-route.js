// Test route chinhanh với ID thật

const API_BASE = 'http://localhost:5000';

async function testBranchRoute() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🧪 Testing Branch Route...\n');

  try {
    const realBranchId = '68f9b1e3f1d8f1ecde6c5eaa'; // ID thật từ test trước
    
    console.log('1. Testing GET /danhmuc/chinhanh/' + realBranchId);
    const branchResponse = await fetch(`${API_BASE}/danhmuc/chinhanh/${realBranchId}`);
    
    console.log('Status:', branchResponse.status);
    
    if (branchResponse.ok) {
      const categories = await branchResponse.json();
      console.log('Found categories for branch:', Array.isArray(categories) ? categories.length : 'non-array');
      if (Array.isArray(categories)) {
        console.log('Categories:', categories.map(c => ({ 
          ten: c.ten, 
          chinhanhID: c.chinhanhID ? (c.chinhanhID._id || c.chinhanhID) : null 
        })));
      }
    } else {
      const errorText = await branchResponse.text();
      console.log('Error response:', errorText.substring(0, 200));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBranchRoute();