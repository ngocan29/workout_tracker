// Script để cập nhật existing users với chinhanhID
const mongoose = require('mongoose');
const User = require('./models/User');

async function updateExistingUsers() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://la_workout_tracker:lawt123456@workout-tracker.ocexcyq.mongodb.net/workout_tracker';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const branchId = '68f9b1e3f1d8f1ecde6c5eaa';

    // Update employee user
    const employeeResult = await User.updateOne(
      { email: 'employee@test.com' },
      {
        $set: {
          'additional_info.chinhanhID': branchId,
          'additional_info.trangthai_vai_tro': 'active',
          'additional_info.ngaybatdau': new Date()
        }
      }
    );
    console.log('✅ Updated employee:', employeeResult);

    // Update customer user  
    const customerResult = await User.updateOne(
      { email: 'customer@test.com' },
      {
        $set: {
          'additional_info.chinhanhID': branchId,
          'additional_info.trangthai_vai_tro': 'active',
          'additional_info.ngaydangky': new Date()
        }
      }
    );
    console.log('✅ Updated customer:', customerResult);

    // Lấy employee ID để assign cho customer
    const employee = await User.findOne({ 
      email: 'employee@test.com',
      'additional_info.vai_tro': 'nhanvien'
    });

    if (employee) {
      // Assign customer to employee
      const assignResult = await User.updateOne(
        { email: 'customer@test.com' },
        {
          $set: {
            'additional_info.nhanvienUserID': employee._id
          }
        }
      );
      console.log('✅ Assigned customer to employee:', assignResult);
      console.log(`👨‍💼 Employee ID: ${employee._id}`);
    }

    console.log('\n🎉 Successfully updated existing users!');

  } catch (error) {
    console.error('❌ Error updating users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateExistingUsers();