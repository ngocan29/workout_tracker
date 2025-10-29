// Test script để kiểm tra APIs
const baseUrl = 'http://localhost:5000';  // Sử dụng local server để test
const branchId = '68f9b1e3f1d8f1ecde6c5eaa';
const employeeId = '68feba1805174c4fe757baab';

console.log('🧪 Testing Customer APIs...\n');

// Test 1: API cho Business - lấy tất cả khách hàng trong chi nhánh
console.log('1️⃣ Testing Business API: GET /users/khachhang/' + branchId);
fetch(`${baseUrl}/users/khachhang/${branchId}`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Business API Response:');
    console.log(`   Found ${data.length} customers`);
    data.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.ten} (${customer.email})`);
      if (customer.additional_info?.nhanvienUserID) {
        console.log(`      👨‍💼 Assigned to employee: ${customer.additional_info.nhanvienUserID}`);
      } else {
        console.log(`      ⚪ No assigned employee`);
      }
    });
    console.log('');
  })
  .catch(error => {
    console.error('❌ Business API Error:', error);
  });

// Test 2: API cho Employee - chỉ khách hàng được phân công
setTimeout(() => {
  console.log('2️⃣ Testing Employee API: GET /users/khachhang/nhanvien/' + employeeId + '/' + branchId);
  fetch(`${baseUrl}/users/khachhang/nhanvien/${employeeId}/${branchId}`)
    .then(response => response.json())
    .then(data => {
      console.log('✅ Employee API Response:');
      console.log(`   Found ${data.length} assigned customers`);
      data.forEach((customer, index) => {
        console.log(`   ${index + 1}. ${customer.ten} (${customer.email})`);
        console.log(`      👨‍💼 Assigned to: ${customer.additional_info?.nhanvienUserID}`);
      });
      console.log('');
    })
    .catch(error => {
      console.error('❌ Employee API Error:', error);
    });
}, 1000);

console.log('📋 Expected Results:');
console.log('- Business API: Should return 2 customers (customer@test.com + customer2@test.com)');
console.log('- Employee API: Should return 1 customer (customer@test.com only)');
console.log('- Customer assigned to employee should show employee ID');
console.log('');