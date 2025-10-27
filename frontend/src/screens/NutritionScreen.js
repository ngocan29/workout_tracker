import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import ProgressBar from 'react-native-progress/Bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/ui/Navbar';
import { Colors } from '../constants/Colors';

export default function NutritionScreen({ isDarkMode, setDarkMode }) {
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [isFirstTimeOrNewMonth, setIsFirstTimeOrNewMonth] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [waterGoal] = useState(8); // Fixed goal of 8 glasses

  // Check nutrition data on component mount
  useEffect(() => {
    checkNutritionData();
    loadWaterIntake();
  }, []);

  // Check for new day and reset water intake
  useEffect(() => {
    const checkNewDay = async () => {
      const today = new Date().toDateString();
      const lastWaterDate = await AsyncStorage.getItem('waterDate');
      
      if (lastWaterDate !== today) {
        // New day - reset water intake
        setWaterGlasses(0);
        await AsyncStorage.setItem('waterGlasses', '0');
        await AsyncStorage.setItem('waterDate', today);
      }
    };

    checkNewDay();
    
    // Set up interval to check for new day every minute
    const interval = setInterval(checkNewDay, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadWaterIntake = async () => {
    try {
      const savedGlasses = await AsyncStorage.getItem('waterGlasses');
      const savedDate = await AsyncStorage.getItem('waterDate');
      const today = new Date().toDateString();
      
      if (savedDate === today && savedGlasses) {
        setWaterGlasses(parseInt(savedGlasses));
      } else {
        // Different day or no saved data - reset
        setWaterGlasses(0);
        await AsyncStorage.setItem('waterGlasses', '0');
        await AsyncStorage.setItem('waterDate', today);
      }
    } catch (error) {
      console.error('Error loading water intake:', error);
    }
  };

  const addWaterGlass = async () => {
    const newCount = waterGlasses + 1;
    setWaterGlasses(newCount);
    
    try {
      await AsyncStorage.setItem('waterGlasses', newCount.toString());
      
      // Check if goal is reached
      if (newCount >= waterGoal) {
        Alert.alert(
          '🎉 Chúc mừng!',
          `Bạn đã hoàn thành mục tiêu uống ${waterGoal} cốc nước hôm nay!\n\n💧 Việc duy trì đủ nước giúp:\n• Cơ thể khỏe mạnh\n• Tăng hiệu suất tập luyện\n• Cải thiện trao đổi chất\n• Da đẹp và tươi trẻ\n\nTiếp tục duy trì thói quen tốt này! 💪`,
          [
            { 
              text: 'Tuyệt vời!', 
              style: 'default',
              onPress: () => {
                // Could add confetti animation or other celebration effects here
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error saving water intake:', error);
    }
  };

  const checkNutritionData = async () => {
    try {
      // Get user data and nutrition data from storage
      const userData = await AsyncStorage.getItem('userData');
      const nutritionDataStr = await AsyncStorage.getItem('nutritionData');
      const lastUpdateStr = await AsyncStorage.getItem('nutritionLastUpdate');
      
      if (!userData) return;
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Check if it's first day of new month
      const isFirstDayOfMonth = currentDate.getDate() === 1;
      
      let shouldShowModal = false;
      
      if (!nutritionDataStr) {
        // No nutrition data exists - first time
        shouldShowModal = true;
        setIsFirstTimeOrNewMonth(false);
      } else if (lastUpdateStr) {
        // Check if last update was in previous month
        const lastUpdate = new Date(lastUpdateStr);
        const lastUpdateMonth = lastUpdate.getMonth();
        const lastUpdateYear = lastUpdate.getFullYear();
        
        if (isFirstDayOfMonth && (lastUpdateMonth !== currentMonth || lastUpdateYear !== currentYear)) {
          // First day of new month and hasn't updated this month
          shouldShowModal = true;
          setIsFirstTimeOrNewMonth(true);
        }
      }
      
      if (nutritionDataStr) {
        setNutritionData(JSON.parse(nutritionDataStr));
      }
      
      setShowNutritionModal(shouldShowModal);
    } catch (error) {
      console.error('Error checking nutrition data:', error);
    }
  };

  const handleSaveNutritionData = async (data) => {
    try {
      const currentDate = new Date().toISOString();
      await AsyncStorage.setItem('nutritionData', JSON.stringify(data));
      await AsyncStorage.setItem('nutritionLastUpdate', currentDate);
      
      setNutritionData(data);
      setShowNutritionModal(false);
      
      Alert.alert(
        'Thành công', 
        isFirstTimeOrNewMonth ? 'Đã cập nhật thông tin thể chất cho tháng mới!' : 'Đã lưu thông tin thể chất!'
      );
    } catch (error) {
      console.error('Error saving nutrition data:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  const mealData = [
    { meal: "Bữa Sáng", calories: 420, protein: 25, carbs: 45, fat: 18 },
    // ... other meals
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      <ScrollView style={styles.scrollView}>
        {/* Daily Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Tổng Quan</Title>
            <View style={styles.nutrientsGrid}>
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: '#3b82f6' }]}>1,630</Text>
                <Text style={styles.nutrientLabel}>Calo</Text>
              </View>
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: '#10b981' }]}>96g</Text>
                <Text style={styles.nutrientLabel}>Protein</Text>
              </View>
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: '#f59e0b' }]}>160g</Text>
                <Text style={styles.nutrientLabel}>Carbs</Text>
              </View>
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: '#ef4444' }]}>72g</Text>
                <Text style={styles.nutrientLabel}>Fat</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Water Intake */}
        <Card style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <Title style={styles.waterTitle}>Lượng Nước Uống</Title>
            <View style={styles.headerButtons}>
              <Text style={styles.resetTime}>Reset: 0:00</Text>
              <Button 
                icon="plus" 
                mode="outlined" 
                style={styles.addButton}
                onPress={addWaterGlass}
                disabled={waterGlasses >= waterGoal}
              >
                {waterGlasses >= waterGoal ? 'Hoàn thành' : 'Thêm'}
              </Button>
            </View>
          </View>
          <View style={styles.waterProgress}>
            <View style={styles.waterInfo}>
              <View style={styles.waterGlassDisplay}>
                <Text style={styles.waterGlassText}>{waterGlasses} / {waterGoal}</Text>
                <Text style={styles.waterGlassIcon}>🥛</Text>
              </View>
              <Text style={{ color: '#3b82f6', fontSize: 14 }}>
                {(waterGlasses * 0.25).toFixed(1)}L / {(waterGoal * 0.25).toFixed(1)}L
              </Text>
            </View>
            <ProgressBar 
              progress={Math.min(waterGlasses / waterGoal, 1)} 
              width={200} 
              height={8}
              color={waterGlasses >= waterGoal ? "#10b981" : "#45B7D1"} 
              unfilledColor="#e5e7eb"
              borderWidth={0}
            />
            <View style={styles.waterEmojiContainer}>
              <Text style={styles.waterEmoji}>💧</Text>
              {waterGlasses >= waterGoal && (
                <Text style={styles.completedEmoji}>🎉</Text>
              )}
            </View>
            
            {/* Water glasses visual indicator */}
            <View style={styles.glassesRow}>
              {Array.from({ length: waterGoal }, (_, index) => (
                <Text 
                  key={index} 
                  style={[
                    styles.glassIcon,
                    { opacity: index < waterGlasses ? 1 : 0.3 }
                  ]}
                >
                  🥛
                </Text>
              ))}
            </View>
          </View>
        </Card>

        {/* Meal Log */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
              Gợi Ý Bữa Ăn Sức Khỏe
            </Title>
          </View>
          {mealData.map((meal, index) => (
            <TouchableOpacity key={index} style={styles.mealCard}>
              <View style={styles.mealRow}>
                <View style={styles.mealIcon}>🍽️</View>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.meal}</Text>
                  <View style={styles.nutrientsRow}>
                    <Text>{meal.calories} cal</Text>
                    <Text>{meal.protein}g protein</Text>
                    <Text>{meal.carbs}g carbs</Text>
                    <Text>{meal.fat}g fat</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Nutrition Data Modal */}
      {showNutritionModal && (
        <NutritionDataModal
          visible={showNutritionModal}
          existingData={nutritionData}
          isUpdate={isFirstTimeOrNewMonth}
          isDarkMode={isDarkMode}
          onClose={() => setShowNutritionModal(false)}
          onSave={handleSaveNutritionData}
        />
      )}
    </View>
  );
}

// Component modal thông tin thể chất cho dinh dưỡng
function NutritionDataModal({ visible, existingData, isUpdate, isDarkMode, onClose, onSave }) {
  const [form, setForm] = useState({
    height: '',
    weight: ''
  });

  useEffect(() => {
    if (existingData) {
      setForm({
        height: existingData.height || '',
        weight: existingData.weight || ''
      });
    }
  }, [existingData]);

  const handleSave = () => {
    // Validation
    if (!form.height || !form.weight) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin chiều cao và cân nặng');
      return;
    }

    const nutritionData = {
      height: form.height,
      weight: form.weight,
      createdAt: new Date().toISOString()
    };

    onSave(nutritionData);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.modalContainer, { 
        backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb' 
      }]}>
        {/* Header */}
        <View style={[styles.modalHeader, { 
          backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
          borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
        }]}>
          <Text style={[styles.modalTitle, { 
            color: isDarkMode ? Colors.darkText : Colors.black 
          }]}>
            {isUpdate ? 'Cập Nhật Thông Tin Thể Chất' : 'Thông Tin Thể Chất'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.modalContent}>
          {/* Basic Info */}
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <View style={styles.inputColumn}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { 
                    color: isDarkMode ? Colors.darkText : Colors.black 
                  }]}>Chiều cao (cm)</Text>
                  <TextInput
                    style={[styles.fullInput, { 
                      backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                      color: isDarkMode ? Colors.darkText : Colors.black,
                      borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                    }]}
                    placeholder="Nhập chiều cao..."
                    placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                    value={form.height}
                    onChangeText={(text) => setForm(prev => ({ ...prev, height: text }))}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { 
                    color: isDarkMode ? Colors.darkText : Colors.black 
                  }]}>Cân nặng (kg)</Text>
                  <TextInput
                    style={[styles.fullInput, { 
                      backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                      color: isDarkMode ? Colors.darkText : Colors.black,
                      borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                    }]}
                    placeholder="Nhập cân nặng..."
                    placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                    value={form.weight}
                    onChangeText={(text) => setForm(prev => ({ ...prev, weight: text }))}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Save Button */}
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={[styles.saveButtonFull, { backgroundColor: Colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonFullText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  summaryCard: { margin: 16, borderRadius: 12 },
  summaryTitle: { fontSize: 18, marginBottom: 16 },
  nutrientsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  nutrientItem: { alignItems: 'center' },
  nutrientValue: { fontSize: 20, fontWeight: 'bold' },
  nutrientLabel: { fontSize: 12, color: 'gray' },
  progressContainer: { marginTop: 8 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  waterCard: { margin: 16, borderRadius: 12 },
  waterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  waterTitle: { fontSize: 18 },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetTime: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  waterProgress: { alignItems: 'center', padding: 16 },
  waterInfo: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
  waterEmoji: { fontSize: 32, marginTop: 8 },
  waterEmojiContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 8 
  },
  completedEmoji: { 
    fontSize: 24, 
    marginLeft: 8,
    opacity: 1 
  },
  waterGlassDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterGlassText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  waterGlassIcon: {
    fontSize: 18,
  },
  glassesRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  glassIcon: {
    fontSize: 20,
    margin: 2,
  },
  section: { marginHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18 },
  mealCard: { backgroundColor: 'white', borderRadius: 12, marginBottom: 12, elevation: 2 },
  mealRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  mealIcon: { fontSize: 24, marginRight: 12 },
  mealInfo: { flex: 1 },
  mealName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  nutrientsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailButton: { marginLeft: 8 },
  addButton: { 
    borderRadius: 8,
    minWidth: 80,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  formSection: {
    margin: 16,
    borderWidth: 1,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputColumn: {
    flexDirection: 'column',
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'column',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  fullInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButtonContainer: {
    padding: 16,
    paddingTop: 24,
  },
  saveButtonFull: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonFullText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});