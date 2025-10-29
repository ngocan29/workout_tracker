// Test Category API với logic chi nhánh

const API_BASE = 'http://localhost:5000';

async function testCategoryWithBranch() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🧪 Testing Category API with Branch Logic...\n');

  try {
    // Test 1: Tạo category với chinhanhID
    console.log('1. Testing POST /danhmuc with chinhanhID');
    const sampleBranchId = '6745e24d123456789abcdef0'; // Sample ObjectId
    const createResponse = await fetch(`${API_BASE}/danhmuc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ten: 'Category with Branch ' + Date.now(),
        chinhanhID: sampleBranchId
      })
    });
    
    console.log('Status:', createResponse.status);
    const responseText = await createResponse.text();
    console.log('Raw response:', responseText);
    
    let newCategory;
    try {
      newCategory = JSON.parse(responseText);
      console.log('Created category:', {
        id: newCategory._id,
        ten: newCategory.ten,
        chinhanhID: newCategory.chinhanhID
      });
    } catch (parseError) {
      console.log('Error parsing JSON:', parseError.message);
    }
    console.log('');

    // Test 2: Tạo category không có chinhanhID
    console.log('2. Testing POST /danhmuc without chinhanhID');
    const createResponse2 = await fetch(`${API_BASE}/danhmuc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ten: 'Category without Branch ' + Date.now()
      })
    });
    
    console.log('Status:', createResponse2.status);
    const responseText2 = await createResponse2.text();
    
    let newCategory2;
    try {
      newCategory2 = JSON.parse(responseText2);
      console.log('Created category:', {
        id: newCategory2._id,
        ten: newCategory2.ten,
        chinhanhID: newCategory2.chinhanhID
      });
    } catch (parseError) {
      console.log('Error parsing JSON:', parseError.message);
    }
    console.log('');

    // Test 3: GET categories theo chi nhánh
    console.log('3. Testing GET /danhmuc/chinhanh/:chinhanhID');
    const getBranchResponse = await fetch(`${API_BASE}/danhmuc/chinhanh/${sampleBranchId}`);
    
    console.log('Status:', getBranchResponse.status);
    const branchResponseText = await getBranchResponse.text();
    
    try {
      const branchCategories = JSON.parse(branchResponseText);
      console.log('Categories for branch:', Array.isArray(branchCategories) ? branchCategories.length : 'non-array');
      if (Array.isArray(branchCategories)) {
        console.log('Sample categories:', branchCategories.slice(0, 3).map(c => ({ 
          ten: c.ten, 
          chinhanhID: c.chinhanhID 
        })));
      }
    } catch (parseError) {
      console.log('Error parsing JSON:', parseError.message);
      console.log('Raw response:', branchResponseText);
    }
    console.log('');

    // Test 4: GET tất cả categories
    console.log('4. Testing GET /danhmuc (all categories)');
    const getAllResponse = await fetch(`${API_BASE}/danhmuc`);
    
    console.log('Status:', getAllResponse.status);
    const allResponseText = await getAllResponse.text();
    
    try {
      const allCategories = JSON.parse(allResponseText);
      console.log('Total categories:', Array.isArray(allCategories) ? allCategories.length : 'non-array');
      if (Array.isArray(allCategories)) {
        console.log('Sample categories:', allCategories.slice(0, 3).map(c => ({ 
          ten: c.ten, 
          chinhanhID: c.chinhanhID ? c.chinhanhID._id || c.chinhanhID : null 
        })));
      }
    } catch (parseError) {
      console.log('Error parsing JSON:', parseError.message);
      console.log('Raw response:', allResponseText);
    }
    console.log('');

    console.log('✅ Category Branch tests completed!');

  } catch (error) {
    console.error('❌ Error testing Category Branch APIs:', error.message);
  }
}

// Chạy test
testCategoryWithBranch();