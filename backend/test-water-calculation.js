const axios = require('axios');

async function testWaterCalculation() {
  try {
    console.log('💧 TESTING WATER CALCULATION FEATURE');
    console.log('======================================\n');

    const API_URL = 'http://localhost:5000';

    // 1. Test lấy dữ liệu dinh dưỡng hiện có
    console.log('1️⃣ Getting existing nutrition data...');
    
    try {
      const getResponse = await axios.get(`${API_URL}/dinhduong?all=true`);
      
      if (getResponse.data && getResponse.data.length > 0) {
        const latestData = getResponse.data[0];
        console.log('✅ Found nutrition data:', {
          userID: latestData.userID,
          chieucao: latestData.chieucao,
          cannang: latestData.cannang,
          luongnuoc: latestData.luongnuoc,
          calo: latestData.calo
        });

        // 2. Tính toán water per glass
        console.log('\n2️⃣ Calculating water per glass...');
        const totalWaterL = latestData.luongnuoc;
        const waterPerGlassML = Math.round((totalWaterL * 1000) / 8);
        
        console.log(`📊 Water calculations:`);
        console.log(`   • Total water needed: ${totalWaterL}L`);
        console.log(`   • Water per glass: ${waterPerGlassML}ml`);
        console.log(`   • Total glasses: 8`);
        console.log(`   • Verification: 8 × ${waterPerGlassML}ml = ${8 * waterPerGlassML}ml = ${(8 * waterPerGlassML / 1000)}L`);

        // 3. Simulate drinking glasses
        console.log('\n3️⃣ Simulating water intake...');
        
        for (let glasses = 1; glasses <= 8; glasses++) {
          const currentWaterML = glasses * waterPerGlassML;
          const currentWaterL = currentWaterML / 1000;
          const progress = (glasses / 8 * 100).toFixed(1);
          
          console.log(`🥛 Glass ${glasses}: ${currentWaterML}ml (${currentWaterL.toFixed(2)}L) - ${progress}% complete`);
          
          if (glasses === 8) {
            console.log('🎉 Water goal completed!');
          }
        }

      } else {
        console.log('❌ No nutrition data found');
        
        // Create test data
        console.log('\n🔧 Creating test nutrition data...');
        const testData = {
          userID: '68ef57e101e5459beb3723a4', // Use existing user ID
          chieucao: 170,
          cannang: 65
        };

        const postResponse = await axios.post(`${API_URL}/dinhduong`, testData);
        console.log('✅ Created test data:', {
          luongnuoc: postResponse.data.luongnuoc,
          waterPerGlass: Math.round((postResponse.data.luongnuoc * 1000) / 8)
        });
      }

    } catch (error) {
      console.error('❌ API Error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testWaterCalculation();