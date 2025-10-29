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

async function testCustomerAPI() {
  console.log('Testing Customer API endpoints...\n');

  try {
    // Test 1: Create new customer
    console.log('1. Testing POST /users/customer - Create new customer');
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
      fullName: 'Test Customer API',
      email: 'testapi@example.com',
      phone: '0987654321',
      address: 'Test Address API',
      gender: 'male',
      password: 'testpassword123',
      chinhanhID: '68f9b1e3f1d8f1ecde6c5eaa' // Existing branch ID
    };

    const createResult = await makeRequest(createOptions, JSON.stringify(newCustomer));
    console.log('Create result:', createResult.status, createResult.data);

    if (createResult.status === 201 && createResult.data.success) {
      const customerId = createResult.data.customer._id;
      console.log('✅ Customer created successfully with ID:', customerId);

      // Test 2: Update customer
      console.log('\n2. Testing PUT /users/customer/:id - Update customer');
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
        fullName: 'Test Customer API Updated',
        phone: '0976543210',
        address: 'Updated Address API'
      };

      const updateResult = await makeRequest(updateOptions, JSON.stringify(updateData));
      console.log('Update result:', updateResult.status, updateResult.data);

      if (updateResult.status === 200 && updateResult.data.success) {
        console.log('✅ Customer updated successfully');

        // Test 3: Delete customer
        console.log('\n3. Testing DELETE /users/customer/:id - Delete customer');
        const deleteOptions = {
          hostname: 'localhost',
          port: 5000,
          path: `/users/customer/${customerId}`,
          method: 'DELETE',
        };

        const deleteResult = await makeRequest(deleteOptions);
        console.log('Delete result:', deleteResult.status, deleteResult.data);

        if (deleteResult.status === 200 && deleteResult.data.success) {
          console.log('✅ Customer deleted successfully');
        } else {
          console.log('❌ Failed to delete customer');
        }
      } else {
        console.log('❌ Failed to update customer');
      }
    } else {
      console.log('❌ Failed to create customer');
    }

    // Test 4: Test validation - create customer without required fields
    console.log('\n4. Testing validation - Create customer without required fields');
    const invalidCustomer = {
      phone: '0987654321',
      address: 'Test Address'
    };

    const validationResult = await makeRequest(createOptions, JSON.stringify(invalidCustomer));
    console.log('Validation result:', validationResult.status, validationResult.data);

    if (validationResult.status === 400) {
      console.log('✅ Validation working correctly');
    } else {
      console.log('❌ Validation not working properly');
    }

    console.log('\n🎉 Customer API testing completed!');

  } catch (error) {
    console.error('❌ Error testing Customer API:', error);
  }
}

// Run the test
testCustomerAPI();