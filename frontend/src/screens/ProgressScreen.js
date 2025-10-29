import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/ui/Navbar';
import { Colors } from '../constants/Colors';
import { API_CONFIG } from '../constants/api';

export default function ProgressScreen({ isDarkMode, setDarkMode }) {
  const [showBodyMeasurementModal, setShowBodyMeasurementModal] = useState(false);
  const [bodyMeasurements, setBodyMeasurements] = useState([]);
  const [isFirstTimeOrNewMonth, setIsFirstTimeOrNewMonth] = useState(false);
  const [statistics, setStatistics] = useState({
    totalWorkoutTime: 0,
    totalExercisesCompleted: 0,
    currentStreak: 0,
    weeklyAverage: 0
  });

  useEffect(() => {
    checkBodyMeasurementData();
    loadStatistics();
    fetchBodyMeasurements();
  }, []);

  const loadStatistics = async () => {
    try {
      // Load workout data from AsyncStorage or API
      const workoutDataStr = await AsyncStorage.getItem('workoutHistory');
      const goalDataStr = await AsyncStorage.getItem('goalHistory');
      
      let totalTime = 0;
      let totalExercises = 0;
      let streak = 0;
      let weeklyAverage = 0;
      
      if (workoutDataStr) {
        const workoutData = JSON.parse(workoutDataStr);
        // Calculate total workout time and exercises
        totalTime = workoutData.reduce((sum, workout) => sum + (workout.duration || 0), 0);
        totalExercises = workoutData.reduce((sum, workout) => sum + (workout.exercises?.length || 0), 0);
      }
      
      // Calculate streak from goal data (reuse logic from HomeScreen)
      if (goalDataStr) {
        const goalData = JSON.parse(goalDataStr);
        // Calculate current streak
        for (let i = goalData.length - 1; i >= 0; i--) {
          if (goalData[i]?.achieved) {
            streak++;
          } else {
            break;
          }
        }
      }
      
      // Calculate weekly average (simplified)
      weeklyAverage = totalExercises > 0 ? (totalExercises / 4).toFixed(1) : 0;
      
      setStatistics({
        totalWorkoutTime: totalTime,
        totalExercisesCompleted: totalExercises,
        currentStreak: streak,
        weeklyAverage: parseFloat(weeklyAverage)
      });
      
    } catch (error) {
      console.error('Error loading statistics:', error);
      // Set default values on error
      setStatistics({
        totalWorkoutTime: 245,
        totalExercisesCompleted: 48,
        currentStreak: 12,
        weeklyAverage: 4.2
      });
    }
  };

  const checkBodyMeasurementData = async () => {
    try {
      // Get user data and body measurement data from storage
      const userData = await AsyncStorage.getItem('userData');
      const bodyMeasurementDataStr = await AsyncStorage.getItem('bodyMeasurementData');
      const lastUpdateStr = await AsyncStorage.getItem('bodyMeasurementLastUpdate');
      
      if (!userData) return;
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Check if it's first day of new month
      const isFirstDayOfMonth = currentDate.getDate() === 1;
      
      let shouldShowModal = false;
      
      if (!bodyMeasurementDataStr) {
        // No body measurement data exists - first time
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
      
      if (bodyMeasurementDataStr) {
        setBodyMeasurements(JSON.parse(bodyMeasurementDataStr));
      }
      
      setShowBodyMeasurementModal(shouldShowModal);
    } catch (error) {
      console.error('Error checking body measurement data:', error);
    }
  };

  //luu so do co the vao db
  const handleSaveBodyMeasurements = async (measurements) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy userId. Vui lòng đăng nhập lại.');
        return;
      }

      const bophanData = measurements.map(m => ({
        ten: m.name,
        sodo: parseFloat(m.value),
        sodothangtruoc: 0,
      }));

      const payload = {
        userID: userId,
        bophan: bophanData,
        ngaytao: new Date(),
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/sodocothe/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('✅ Đã lưu số đo cơ thể:', result);

      if (response.ok) {
        Alert.alert('Thành công', 'Đã lưu số đo cơ thể!');
        setShowBodyMeasurementModal(false);
        await fetchBodyMeasurements(); //dung ham goi api update du lieu tu db
      } else {
        throw new Error(result.error || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('❌ Lỗi lưu số đo:', error);
      Alert.alert('Lỗi', 'Không thể lưu số đo cơ thể.');
    }
  };
  

  const fetchBodyMeasurements = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.log('Chưa có userId');
        return;
      }

      // Gọi API lấy số đo cơ thể theo user
      const response = await fetch(`${API_CONFIG.BASE_URL}/sodocothe/user/${userId}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // Giả sử backend trả danh sách, ta lấy bản mới nhất
        const latest = data[0];

        // Cập nhật state
        setBodyMeasurements(latest.bophan || []);

        // Lưu vào AsyncStorage nếu cần
        await AsyncStorage.setItem('bodyMeasurementData', JSON.stringify(latest.bophan));

        console.log('✅ Đã tải số đo mới nhất:', latest.bophan);
      } else {
        console.log('Không có dữ liệu số đo từ API');
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải số đo cơ thể:', error);
    }
  };


  // Get current measurements to display
  const getCurrentMeasurements = () => {
    if (bodyMeasurements.length > 0) {
      return bodyMeasurements;
    }
    // Default measurements for display
    return [
      { name: "Vòng Eo", value: "78", change: "-3cm", color: "#10b981" },
      { name: "Vòng Ngực", value: "95", change: "+2cm", color: "#3b82f6" },
      { name: "Vòng Đùi", value: "58", change: "-1cm", color: "#10b981" },
      { name: "Vòng Tay", value: "32", change: "+1cm", color: "#3b82f6" },
    ];
  };

  const [weight, setWeight] = useState(null);

  //lay can nang tu NutritionScreen hien thi ra
  useEffect(() => {
    const loadWeight = async () => {
      try {
        //Lấy dữ liệu từ AsyncStorage (đã lưu trong NutritionScreen)
        const dataStr = await AsyncStorage.getItem('nutritionData');

        if (dataStr) {
          const data = JSON.parse(dataStr);
          //Lấy giá trị cân nặng ra
          setWeight(data.weight);
          console.log('Cân nặng hiện tại:', data.weight);
        } else {
          console.log('Chưa có dữ liệu cân nặng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy cân nặng:', error);
      }
    };

    loadWeight();
  }, []);

  const [nutrition, setNutrition] = useState({
    chieucao: 0,
    cannang: 0,
    bmi: 0,
    lbm: 0,
    luongnuoc: 0,
    calo: 0,
  });

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        //Lấy userId từ AsyncStorage (nếu bạn đã lưu khi đăng nhập)
        const userId = await AsyncStorage.getItem('userId');

        //Nếu chưa có userId, dừng lại
        if (!userId) {
          console.log('Chưa có userId trong AsyncStorage');
          return;
        }

        //Gọi API backend
        const response = await fetch(`http://192.168.1.19:5000/dinhduong/user/${userId}`);
        const data = await response.json();
        console.log("Dữ liệu nhận được:", data);

        //Lấy bản ghi mới nhất (vì server sort theo ngaytao)
        if (Array.isArray(data) && data.length > 0) {
          setNutrition(data[0]);
        } else {
          console.log('Không có dữ liệu dinh dưỡng');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu dinh dưỡng:', error);
      }
    };

    fetchNutrition();
  }, []);

  if (!nutrition) {
    <View>
      return <Text style={styles.loading}>Đang tải dữ liệu...</Text>;
    </View>
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      <ScrollView style={styles.scrollView}>
        {/* Progress Overview */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Title style={styles.overviewTitle}>Tổng Quan Tiến Độ</Title>
            <View style={styles.overviewGrid}>
              <View style={styles.overviewItem}>
                <Text style={styles.emoji}>📈</Text>
                <Text style={styles.statTitle}>Cân Nặng Hiện Tại</Text>
                <Text style={[styles.statValue, { color: '#10b981' }]}>{nutrition.cannang} kg</Text>
                <Text style={styles.statChange}>-2.3kg từ tháng trước</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.emoji}>💪</Text>
                <Text style={styles.statTitle}>Khối Lượng Cơ</Text>
                <Text style={[styles.statValue, { color: '#3b82f6' }]}>{nutrition?.lbm?.toFixed(2)}</Text>
                <Text style={styles.statChange}>+1.1kg từ tháng trước</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/*         Thông tin Dinh Dưỡng
      <Text>Chiều cao:             {nutrition.chieucao} cm
      <Text>Cân nặng:              {nutrition.cannang} kg
      <Text>BMI:                   {nutrition.bmi?.toFixed(2)}
      <Text>LBM (Khối lượng cơ):   {nutrition.lbm?.toFixed(2)} kg
      <Text>Lượng nước cần:        {nutrition.luongnuoc} L
      <Text>Calo:                  {nutrition.calo} kcal
      <Text>Protein:               {nutrition.protein}
      <Text>Carbs:                 {nutrition.carbs} g
      <Text>Fat:                   {nutrition.fat} g
      <Text>Ngày tạo:              {new Date(nutrition.ngaytao).toLocaleDateString('vi-VN')}
        */}

        {/* Body Measurements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Số Đo Cơ Thể
            </Title>
            <Button 
              mode="outlined" 
              style={styles.updateButton}
              onPress={() => setShowBodyMeasurementModal(true)}
            >
              Cập nhật
            </Button>
          </View>
          <Card style={styles.measurementsCard}>
            <Card.Content>
              {getCurrentMeasurements().map((measurement, index) => (
                <View key={index} style={styles.measurementRow}>
                  <Text style={styles.measurementLabel}>{measurement.name}</Text>
                  <View style={styles.measurementValueContainer}>
                    <Text style={styles.measurementValue}>
                      {measurement.value}cm
                    </Text>
                    {measurement.change && (
                      <Text style={[styles.measurementChange, { color: measurement.color }]}>
                        {measurement.change}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Thống Kê
            </Title>
          </View>
          <Card style={styles.measurementsCard}>
            <Card.Content>
              <View style={styles.measurementRow}>
                <View style={styles.statLabelContainer}>
                  <Text style={styles.statIcon}>⏱️</Text>
                  <Text style={styles.measurementLabel}>Tổng thời gian tập</Text>
                </View>
                <View style={styles.measurementValueContainer}>
                  <Text style={styles.measurementValue}>{statistics.totalWorkoutTime} phút</Text>
                  <Text style={[styles.measurementChange, { color: '#10b981' }]}>
                    {statistics.totalWorkoutTime > 200 ? '+32 phút tuần này' : 'Hãy tập thêm!'}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

      </ScrollView>

      {/* Body Measurement Modal */}
      {showBodyMeasurementModal && (
        <BodyMeasurementModal
          visible={showBodyMeasurementModal}
          existingMeasurements={bodyMeasurements}
          isUpdate={isFirstTimeOrNewMonth}
          isDarkMode={isDarkMode}
          onClose={() => setShowBodyMeasurementModal(false)}
          onSave={handleSaveBodyMeasurements}
        />
      )}
    </View>
  );
}

// Component modal số đo cơ thể
function BodyMeasurementModal({ visible, existingMeasurements, isUpdate, isDarkMode, onClose, onSave }) {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    if (existingMeasurements && existingMeasurements.length > 0) {
      setMeasurements(existingMeasurements);
    } else {
      // Default measurements for first time
      setMeasurements([
        { name: 'Vòng Eo', value: '' },
        { name: 'Vòng Ngực', value: '' },
        { name: 'Vòng Đùi', value: '' },
        { name: 'Vòng Tay', value: '' }
      ]);
    }
  }, [existingMeasurements]);

  const addNewMeasurement = () => {
    setMeasurements([...measurements, { name: '', value: '' }]);
  };

  const updateMeasurement = (index, field, value) => {
    const newMeasurements = [...measurements];
    newMeasurements[index][field] = value;
    setMeasurements(newMeasurements);
  };

  const removeMeasurement = (index) => {
    const newMeasurements = measurements.filter((_, i) => i !== index);
    setMeasurements(newMeasurements);
  };

  const handleSave = () => {
    // Validation - check if at least one measurement has both name and value
    const validMeasurements = measurements.filter(m => m.name.trim() && m.value.trim());
    
    if (validMeasurements.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập ít nhất một số đo có đầy đủ tên bộ phận và số đo');
      return;
    }

    // Save only valid measurements
    onSave(validMeasurements);
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
            {isUpdate ? 'Cập Nhật Số Đo Cơ Thể' : 'Số Đo Cơ Thể'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollContent}>
          {/* Measurements List */}
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.formSectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black,
                marginBottom: 16
              }]}>
                Thông Tin Số Đo
              </Text>

              {measurements.map((measurement, index) => (
                <View key={index} style={styles.measurementInputRow}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { 
                      color: isDarkMode ? Colors.darkText : Colors.black 
                    }]}>Tên bộ phận</Text>
                    <TextInput
                      style={[styles.measurementInput, { 
                        backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                        color: isDarkMode ? Colors.darkText : Colors.black,
                        borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                      }]}
                      placeholder="VD: Vòng Eo, Vòng Ngực..."
                      placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                      value={measurement.name}
                      onChangeText={(text) => updateMeasurement(index, 'name', text)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { 
                      color: isDarkMode ? Colors.darkText : Colors.black 
                    }]}>Số đo (cm)</Text>
                    <TextInput
                      style={[styles.measurementInput, { 
                        backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                        color: isDarkMode ? Colors.darkText : Colors.black,
                        borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                      }]}
                      placeholder="Nhập số cm..."
                      placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                      value={measurement.value}
                      onChangeText={(text) => updateMeasurement(index, 'value', text)}
                      keyboardType="numeric"
                    />
                  </View>

                  {measurements.length > 1 && (
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => removeMeasurement(index)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {/* Add New Measurement Button */}
              <TouchableOpacity 
                style={[styles.addButton, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : '#f3f4f6' 
                }]}
                onPress={addNewMeasurement}
              >
                <Ionicons name="add" size={20} color={Colors.primary} />
                <Text style={[styles.addButtonText, { color: Colors.primary }]}>
                  Thêm số đo mới
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </ScrollView>

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
  overviewCard: { margin: 16, borderRadius: 12 },
  overviewTitle: { fontSize: 18, marginBottom: 16, textAlign: 'center' },
  overviewGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  overviewItem: { alignItems: 'center', flex: 1 },
  emoji: { fontSize: 32, marginBottom: 8 },
  statTitle: { fontSize: 14, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statChange: { fontSize: 12 },
  section: { marginHorizontal: 16 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  updateButton: {
    borderRadius: 8,
  },
  measurementsCard: { borderRadius: 12 },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  measurementLabel: { flex: 1 },
  measurementValueContainer: { flexDirection: 'row', alignItems: 'center' },
  measurementValue: { fontWeight: 'bold', marginRight: 8 },
  measurementChange: { fontSize: 12, fontWeight: 'bold' },
  statLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  goalCard: { marginBottom: 12, borderRadius: 12 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalTitle: { fontWeight: 'bold', flex: 1 },
  goalDeadline: { fontSize: 12, color: 'gray' },
  goalProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  
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
    borderRadius: 12,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  measurementInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  measurementInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContent: {
    flex: 1,
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