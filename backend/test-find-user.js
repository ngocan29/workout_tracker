// Tìm user ID chính xác từ database
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function findAndTestUser() {
  try {
    console.log('🔍 Tìm user có gioitinh...\n');
    
    // Lấy danh sách customers từ branch
    const branchId = '68f9b1e3f1d8f1ecde6c5eaa';
    const response = await axios.get(`${API_BASE_URL}/users/khachhang/${branchId}`);
    
    if (response.status === 200 && response.data.length > 0) {
      console.log('Users tìm thấy:');
      
      for (let customer of response.data) {
        console.log(`- ${customer.ten} (${customer.email}) - ID: ${customer._id}`);
        console.log(`  Giới tính: ${customer.gioitinh || 'Chưa có'}`);
        
        // Test POST với user này nếu có giới tính
        if (customer.gioitinh) {
          console.log(`\n🧪 Test với user: ${customer.ten}...`);
          
          const postData = {
            userID: customer._id,
            chieucao: 170,
            cannang: 65
          };

          try {
            const postResponse = await axios.post(`${API_BASE_URL}/dinhduong`, postData);
            
            if (postResponse.status === 201) {
              console.log('✅ POST thành công!');
              console.log('Data:', JSON.stringify(postResponse.data, null, 2));
              
              // Test GET
              const getResponse = await axios.get(`${API_BASE_URL}/dinhduong?userID=${customer._id}`);
              if (getResponse.status === 200) {
                console.log('✅ GET thành công!');
                console.log(`Found: ${getResponse.data ? 'Có dữ liệu' : 'Null'}`);
              }
              
              break; // Dừng khi thành công
            }
          } catch (postError) {
            console.log('❌ POST lỗi:', postError.response?.data || postError.message);
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
}

findAndTestUser();