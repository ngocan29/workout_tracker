// Debug Category API từng bước

const API_BASE = 'http://localhost:5000';

async function debugCategoryAPI() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🔍 Debug Category API...\n');

  try {
    // Debug 1: Test route chinhanh với một ID thật từ database
    console.log('1. Debug GET /danhmuc/chinhanh/test');
    const testResponse = await fetch(`${API_BASE}/danhmuc/chinhanh/test`);
    console.log('Status:', testResponse.status);
    const testText = await testResponse.text();
    console.log('Response:', testText.substring(0, 200));
    console.log('');

    // Debug 2: Kiểm tra có ChiNhanh nào trong database không
    console.log('2. Debug GET /chinhanh (check existing branches)');
    const branchResponse = await fetch(`${API_BASE}/chinhanh`);
    console.log('Status:', branchResponse.status);
    
    if (branchResponse.ok) {
      const branches = await branchResponse.json();
      console.log('Found branches:', Array.isArray(branches) ? branches.length : 'non-array');
      if (Array.isArray(branches) && branches.length > 0) {
        const firstBranch = branches[0];
        console.log('First branch:', { _id: firstBranch._id, ten: firstBranch.ten });
        
        // Test với ID thật
        console.log('\\n3. Testing với branch ID thật:', firstBranch._id);
        const realBranchResponse = await fetch(`${API_BASE}/danhmuc/chinhanh/${firstBranch._id}`);
        console.log('Status:', realBranchResponse.status);
        const realBranchText = await realBranchResponse.text();
        console.log('Response:', realBranchText.substring(0, 200));
      }
    }
    console.log('');

    // Debug 3: Kiểm tra POST với dữ liệu chi tiết
    console.log('4. Debug POST với console.log trong server');
    const postData = {
      ten: 'Debug Category ' + Date.now(),
      chinhanhID: '6745e24d123456789abcdef0'
    };
    console.log('Sending data:', postData);
    
    const postResponse = await fetch(`${API_BASE}/danhmuc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    console.log('POST Status:', postResponse.status);
    const postText = await postResponse.text();
    console.log('POST Response:', postText);

  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

// Chạy debug
debugCategoryAPI();