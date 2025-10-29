// Test component để debug nutrition logic
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NutritionService } from '../services/api';

export default function TestNutritionLogic() {
  const [result, setResult] = useState('');

  const testWithRealUser = async () => {
    try {
      // User ID thực tế từ database
      const realUserID = '68f8568c30bee478d7803f09';
      
      console.log('🧪 Testing with real user ID:', realUserID);
      setResult('Testing...');

      const response = await NutritionService.getNutritionData(realUserID);
      
      if (response && response.data) {
        // User có dữ liệu
        const data = response.data;
        console.log('✅ User has data:', data);
        
        // Tính water per glass
        const waterPerGlass = Math.round((data.luongnuoc * 1000) / 8);
        
        setResult(`✅ SUCCESS! User has nutrition data:
- Height: ${data.chieucao}cm
- Weight: ${data.cannang}kg  
- Calories: ${data.calo}
- Water: ${data.luongnuoc}L (${waterPerGlass}ml per glass)
- Date: ${data.ngaytao}

FRONTEND SHOULD: Show nutrition screen normally`);

      } else {
        console.log('❌ User has no data');
        setResult('❌ User has no nutrition data\nFRONTEND SHOULD: Show input modal');
      }

    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 404) {
        setResult('❌ 404 Error - User has no nutrition data\nFRONTEND SHOULD: Show input modal');
      } else {
        setResult(`❌ Error: ${error.message}\nFRONTEND SHOULD: Show input modal`);
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        🧪 Nutrition Logic Test
      </Text>
      
      <Button title="Test Real User Logic" onPress={testWithRealUser} />
      
      <Text style={{ marginTop: 20, fontFamily: 'monospace' }}>
        {result}
      </Text>
    </View>
  );
}