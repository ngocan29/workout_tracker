// Test logic categories theo chi nhánh và userID

const API_BASE = 'http://localhost:5000';

async function testCategoryLogic() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🧪 Testing Category Logic (Branch vs User)...\n');

  try {
    // Test 1: Lấy tất cả users để có sample userID
    console.log('1. Getting sample users...');
    const usersResponse = await fetch(`${API_BASE}/users`);
    
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      const sampleUser = users[0]; // Lấy user đầu tiên
      console.log('Sample user:', { 
        _id: sampleUser._id, 
        ten: sampleUser.ten,
        chinhanhID: sampleUser.chinhanhID 
      });
      
      // Test 2: GET categories theo userID
      console.log('\\n2. Testing GET /danhmuc/user/:userID');
      const userCategoriesResponse = await fetch(`${API_BASE}/danhmuc/user/${sampleUser._id}`);
      console.log('Status:', userCategoriesResponse.status);
      
      if (userCategoriesResponse.ok) {
        const userCategories = await userCategoriesResponse.json();
        console.log('Categories for user:', userCategories.length);
        console.log('Sample:', userCategories.slice(0, 2).map(c => ({
          ten: c.ten,
          userID: c.userID ? (c.userID._id || c.userID) : null,
          chinhanhID: c.chinhanhID ? (c.chinhanhID._id || c.chinhanhID) : null
        })));
      } else {
        const errorText = await userCategoriesResponse.text();
        console.log('Error:', errorText.substring(0, 200));
      }
      
      // Test 3: Tạo category mới với userID
      console.log('\\n3. Testing POST /danhmuc with userID');
      const createResponse = await fetch(`${API_BASE}/danhmuc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': sampleUser._id  // Gửi userID qua header
        },
        body: JSON.stringify({
          ten: 'User Category Test ' + Date.now()
        })
      });
      
      console.log('Status:', createResponse.status);
      if (createResponse.ok) {
        const newCategory = await createResponse.json();
        console.log('Created category:', {
          id: newCategory._id,
          ten: newCategory.ten,
          userID: newCategory.userID ? (newCategory.userID._id || newCategory.userID) : null,
          chinhanhID: newCategory.chinhanhID ? (newCategory.chinhanhID._id || newCategory.chinhanhID) : null
        });
      } else {
        const errorText = await createResponse.text();
        console.log('Error:', errorText);
      }
      
    } else {
      console.log('Could not fetch users');
    }

    console.log('\\n✅ Category logic tests completed!');

  } catch (error) {
    console.error('❌ Error testing Category logic:', error.message);
  }
}

// Chạy test
testCategoryLogic();