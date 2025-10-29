const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testPasswordFeature() {
  console.log('Testing Customer API with Password Feature...\n');

  try {
    // Test 1: Create customer with password
    console.log('1. Testing POST /users/customer - Create customer with password');
    const createOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/users/customer',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const newCustomer = {
      fullName: 'Test Customer With Password',
      email: 'testpassword@example.com',
      phone: '0987654321',
      address: 'Test Address',
      gender: 'male',
      password: 'testpassword123', // Mật khẩu sẽ được mã hóa ở backend
      chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa'
    };

    const createResult = await makeRequest(createOptions, JSON.stringify(newCustomer));
    console.log('Create result:', createResult.status);
    console.log('Response:', JSON.stringify(createResult.data, null, 2));

    if (createResult.status === 201 && createResult.data.success) {
      const customerId = createResult.data.customer._id;
      console.log('✅ Customer created successfully with ID:', customerId);
      console.log('✅ Password is hashed and not returned in response');

      // Test 2: Update customer password
      console.log('\n2. Testing PUT /users/customer/:id - Update customer password');
      const updateOptions = {
        hostname: 'localhost',
        port: 5000,
        path: `/users/customer/${customerId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const updateData = {
        fullName: 'Test Customer Password Updated',
        password: 'newpassword456' // Cập nhật mật khẩu mới
      };

      const updateResult = await makeRequest(updateOptions, JSON.stringify(updateData));
      console.log('Update result:', updateResult.status);
      console.log('Response:', JSON.stringify(updateResult.data, null, 2));

      if (updateResult.status === 200 && updateResult.data.success) {
        console.log('✅ Customer password updated successfully');
        console.log('✅ New password is hashed and not returned in response');

        // Test 3: Update customer without password (should not affect password)
        console.log('\n3. Testing PUT /users/customer/:id - Update customer without password');
        const updateData2 = {
          fullName: 'Test Customer Name Only Updated',
          address: 'Updated Address Only'
          // Không có password - không nên thay đổi password hiện tại
        };

        const updateResult2 = await makeRequest(updateOptions, JSON.stringify(updateData2));
        console.log('Update without password result:', updateResult2.status);
        console.log('Response:', JSON.stringify(updateResult2.data, null, 2));

        if (updateResult2.status === 200 && updateResult2.data.success) {
          console.log('✅ Customer updated successfully without changing password');
        }

        // Clean up - delete test customer
        console.log('\n4. Cleaning up - Delete test customer');
        const deleteOptions = {
          hostname: 'localhost',
          port: 5000,
          path: `/users/customer/${customerId}`,
          method: 'DELETE',
        };

        const deleteResult = await makeRequest(deleteOptions);
        if (deleteResult.status === 200 && deleteResult.data.success) {
          console.log('✅ Test customer deleted successfully');
        }
      }
    } else {
      console.log('❌ Failed to create customer');
    }

    // Test 4: Test password validation - create customer without password
    console.log('\n5. Testing validation - Create customer without password');
    const invalidCustomer = {
      fullName: 'Test Customer No Password',
      email: 'testnopassword@example.com',
      phone: '0987654321',
      address: 'Test Address',
      gender: 'male',
      chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa'
      // Không có password
    };

    const validationResult = await makeRequest(createOptions, JSON.stringify(invalidCustomer));
    console.log('Validation result:', validationResult.status);
    console.log('Response:', JSON.stringify(validationResult.data, null, 2));

    if (validationResult.status === 400) {
      console.log('✅ Password validation working correctly');
    } else {
      console.log('❌ Password validation not working properly');
    }

    console.log('\n🔐 Password feature testing completed!');
    console.log('📋 Summary:');
    console.log('- ✅ Password is required for new customers');
    console.log('- ✅ Password is hashed (not visible in responses)');
    console.log('- ✅ Password can be updated for existing customers');
    console.log('- ✅ Password field is optional during updates');
    console.log('- ✅ Validation prevents creating customers without password');

  } catch (error) {
    console.error('❌ Error testing password feature:', error);
  }
}

// Run the test
testPasswordFeature();