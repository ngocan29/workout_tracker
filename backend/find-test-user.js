const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/workout_tracker';

async function findTestUser() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('workout_tracker');
    
    // Tìm user có giới tính
    const users = await db.collection('users').find({ 
      role: 'customer',
      gioitinh: { $exists: true }
    }).limit(5).toArray();
    
    console.log('Users có giới tính:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.gioitinh}) - ID: ${user._id}`);
    });
    
    // Nếu không có, tìm user bất kỳ
    if (users.length === 0) {
      const allUsers = await db.collection('users').find({ role: 'customer' }).limit(5).toArray();
      console.log('\nTất cả users:');
      allUsers.forEach(user => {
        console.log(`- ${user.email} - ID: ${user._id}`);
      });
    }
    
    await client.close();
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

findTestUser();