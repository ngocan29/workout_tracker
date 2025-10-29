// Test Category API đơn giản (không cần authentication)

const API_BASE = 'http://localhost:5000';

async function testCategoryAPI() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🧪 Testing Category API...\n');

  try {
    // Test 1: GET all categories
    console.log('1. Testing GET /danhmuc');
    const getResponse = await fetch(`${API_BASE}/danhmuc`);
    
    console.log('Status:', getResponse.status);
    const responseText = await getResponse.text();
    console.log('Raw response:', responseText);
    
    let categories;
    try {
      categories = JSON.parse(responseText);
      console.log('Found', Array.isArray(categories) ? categories.length : 'non-array', 'categories');
      if (Array.isArray(categories)) {
        console.log('Sample categories:', categories.slice(0, 3).map(c => ({ 
          ten: c.ten, 
          chinhanhID: c.chinhanhID ? c.chinhanhID._id || c.chinhanhID : null 
        })));
      }
    } catch (parseError) {
      console.log('Error parsing JSON:', parseError.message);
    }
    console.log('');

    // Test 2: POST create new category
    console.log('2. Testing POST /danhmuc (create category)');
    const createResponse = await fetch(`${API_BASE}/danhmuc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ten: 'Test Category ' + Date.now()
      })
    });
    
    console.log('Status:', createResponse.status);
    const newCategory = await createResponse.json();
    console.log('Created category:', {
      id: newCategory._id,
      ten: newCategory.ten,
      chinhanhID: newCategory.chinhanhID
    });
    console.log('');

    // Test 3: PUT update category (if creation was successful)
    if (newCategory._id) {
      console.log('3. Testing PUT /danhmuc/:id (update category)');
      const updateResponse = await fetch(`${API_BASE}/danhmuc/${newCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ten: 'Updated Test Category ' + Date.now()
        })
      });
      
      console.log('Status:', updateResponse.status);
      const updatedCategory = await updateResponse.json();
      console.log('Updated category:', {
        id: updatedCategory._id,
        ten: updatedCategory.ten,
        chinhanhID: updatedCategory.chinhanhID
      });
      console.log('');

      // Test 4: DELETE category
      console.log('4. Testing DELETE /danhmuc/:id (delete category)');
      const deleteResponse = await fetch(`${API_BASE}/danhmuc/${newCategory._id}`, {
        method: 'DELETE'
      });
      
      console.log('Status:', deleteResponse.status);
      const deleteResult = await deleteResponse.json();
      console.log('Delete result:', deleteResult);
      console.log('');
    }

    console.log('✅ Category API tests completed!');

  } catch (error) {
    console.error('❌ Error testing Category APIs:', error.message);
  }
}

// Chạy test
testCategoryAPI();