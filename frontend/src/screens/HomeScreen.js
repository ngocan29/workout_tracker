import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import ProgressCircle from 'react-native-progress/Circle';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Navbar from '../components/ui/Navbar';
import { Colors } from '../constants/Colors';
import { getCustomersByBranch, getCustomersByEmployee } from '../services/customerApi';
import { getEmployeesByBranch } from '../services/employeeApi';
import { createGoal, getTodayGoal, getTotalWorkoutTime } from '../services/goalApi';
import { WorkoutService } from '../services/api';
import CustomerFormModal from '../components/CustomerFormModal';
import EmployeeFormModal from '../components/EmployeeFormModal.js';

export default function HomeScreen({ isDarkMode, setDarkMode, branchData, userData }) {
  const router = useRouter();
  
  // Hiển thị tên user và thông tin chi nhánh
  const userName = userData?.ho_ten || userData?.name || "User";
  const branchName = branchData?.ten_chi_nhanh || branchData?.name || "Chi nhánh";
  
  // Xác định role của user với safe access
  const isBusiness = userData?.loai_tai_khoan === 'business';
  const isEmployee = userData?.loai_tai_khoan === 'personal' && userData?.additional_info?.vai_tro === 'nhanvien';
  const isPersonal = userData?.loai_tai_khoan === 'personal' && (!userData?.additional_info || userData?.additional_info?.vai_tro !== 'nhanvien');
  
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [dailyGoal, setDailyGoal] = useState('');
  const [goalHistory, setGoalHistory] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  // State để lưu số lượng thực tế
  const [customerCount, setCustomerCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // State để quản lý modal
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  
  // State để lưu tiến độ thực tế
  const [todayGoalData, setTodayGoalData] = useState(null);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);

  // Load số lượng khách hàng và nhân viên thực tế
  const loadRealData = useCallback(async () => {
    if (!userData) return;
    
    try {
      const currentBranchId = userData.additional_info?.chinhanhID || userData.chinhanhID;
      if (!currentBranchId) return;

      // Load customers
      let customersData = [];
      if (userData.loai_tai_khoan === 'business') {
        customersData = await getCustomersByBranch(currentBranchId);
      } else if (userData.additional_info?.vai_tro === 'nhanvien') {
        customersData = await getCustomersByEmployee(userData._id, currentBranchId);
      }
      setCustomerCount(customersData.length);

      // Load employees (chỉ cho business user)
      if (userData.loai_tai_khoan === 'business') {
        const employeesResponse = await getEmployeesByBranch(currentBranchId);
        const employeesData = employeesResponse.success ? employeesResponse.data : [];
        setEmployeeCount(employeesData.length);
      }

      // Load workouts for all user types
      try {
        const workoutResponse = await WorkoutService.getWorkouts(userData._id);
        if (workoutResponse.success) {
          setWorkoutCount(workoutResponse.data.length);
        } else {
          setWorkoutCount(0);
        }
      } catch (error) {
        console.error('Error loading workouts:', error);
        setWorkoutCount(0);
      }
      
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading real data:', error);
      // Fallback to default values
      setCustomerCount(0);
      setEmployeeCount(0);
      setWorkoutCount(0);
      setDataLoaded(true);
    }
  }, [userData]);

  // Load workout progress for today
  const loadWorkoutProgress = useCallback(async () => {
    try {
      if (!userData?._id) return;
      
      const totalTime = await getTotalWorkoutTime(userData._id);
      setTotalWorkoutTime(totalTime);
      
      // Calculate progress percentage
      if (todayGoalData && todayGoalData.muctieu) {
        const progress = Math.min(totalTime / parseInt(todayGoalData.muctieu), 1);
        setGoalProgress(progress);
      }
    } catch (error) {
      console.error('Error loading workout progress:', error);
    }
  }, [userData, todayGoalData]);

  const data = userData?.loai_tai_khoan === 'business' 
    ? [
        { value: dataLoaded ? customerCount : (userData?.so_khach_hang || 0), label: "Số Khách Hàng" },
        { value: dataLoaded ? employeeCount : (userData?.so_nhan_vien || 0), label: "Số Nhân Viên" },
        { value: dataLoaded ? workoutCount : 0, label: "Số Bài Tập" }
      ]
    : userData?.loai_tai_khoan === 'personal' && userData?.additional_info?.vai_tro === 'nhanvien'
    ? [
        { value: dataLoaded ? customerCount : (userData?.so_khach_hang || 0), label: "Số Khách Hàng" },
        { value: userData?.lich_hen_gan_nhat || 2, label: "Lịch hẹn gần nhất" },
        { value: dataLoaded ? workoutCount : 0, label: "Số Bài Tập" },
      ]
    : [
        { value: dataLoaded ? workoutCount : 0, label: "Số Bài Tập" },
        { value: 420, label: "Calo đốt" },
        { value: 40, label: "Điểm Thưởng" },
      ];

  const checkTodayGoal = useCallback(async () => {
    try {
      // Chỉ hiển thị modal cho personal user
      if (!isPersonal || !userData?._id) {
        return;
      }
      
      // Check if user has a goal for today
      const todayGoal = await getTodayGoal(userData._id);
      
      if (!todayGoal) {
        setShowGoalModal(true);
      } else {
        setTodayGoalData(todayGoal);
        // Load current workout progress
        await loadWorkoutProgress();
      }
    } catch (error) {
      console.error('Error checking today goal:', error);
      // Fallback to AsyncStorage if API fails
      const today = new Date().toDateString();
      const todayGoalData = await AsyncStorage.getItem(`goal_${today}`);
      
      if (!todayGoalData) {
        setShowGoalModal(true);
      }
    }
  }, [isPersonal, userData, loadWorkoutProgress]);

  const loadGoalHistory = useCallback(async () => {
    try {
      // Load last 7 days of goal history
      const history = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toDateString();
        
        const goalData = await AsyncStorage.getItem(`goal_${dateKey}`);
        if (goalData) {
          const parsed = JSON.parse(goalData);
          history.push({
            date: dateKey,
            goal: parsed.goal,
            completed: parsed.completed || 0,
            achieved: parsed.completed >= parsed.goal
          });
        } else {
          history.push({
            date: dateKey,
            goal: 0,
            completed: 0,
            achieved: false
          });
        }
      }
      
      setGoalHistory(history);
      
      // Calculate current streak
      let streak = 0;
      for (let i = history.length - 2; i >= 0; i--) { // Start from yesterday
        if (history[i].achieved) {
          streak++;
        } else {
          break;
        }
      }
      setCurrentStreak(streak);
      
    } catch (error) {
      console.error('Error loading goal history:', error);
    }
  }, []);

  const saveGoal = async () => {
    if (!dailyGoal || isNaN(dailyGoal) || parseInt(dailyGoal) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập mục tiêu hợp lệ (số phút > 0)');
      return;
    }

    if (!userData?._id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    try {
      // Create goal data for API
      const goalData = {
        userID: userData._id,
        muctieu: dailyGoal,
        thoigiantap: 0,
        trangthai: 'dangtap',
        ngaytao: new Date()
        // baitapID is optional for daily goals
      };
      
      // Save to backend API
      const newGoal = await createGoal(goalData);
      setTodayGoalData(newGoal);
      
      // Also save to AsyncStorage as backup
      const today = new Date().toDateString();
      const localGoalData = {
        goal: parseInt(dailyGoal),
        completed: 0,
        date: today
      };
      await AsyncStorage.setItem(`goal_${today}`, JSON.stringify(localGoalData));
      
      setShowGoalModal(false);
      setDailyGoal('');
      loadGoalHistory();
      loadWorkoutProgress();
      
      Alert.alert('Thành công', `Đã thiết lập mục tiêu ${dailyGoal} phút cho hôm nay!`);
    } catch (error) {
      console.error('Error saving goal:', error);
      Alert.alert('Lỗi', 'Không thể lưu mục tiêu. Vui lòng thử lại!');
    }
  };

  useEffect(() => {
    // Chỉ hiển thị modal chọn mục tiêu cho personal user (customers)
    if (isPersonal) {
      checkTodayGoal();
    }
    loadGoalHistory();
  }, [isPersonal, checkTodayGoal, loadGoalHistory]);

  useEffect(() => {
    // Load dữ liệu thực tế khi có userData
    if (userData) {
      loadRealData();
    }
  }, [userData, loadRealData]);

  useEffect(() => {
    // Load workout progress when goal data is available
    if (todayGoalData && userData) {
      loadWorkoutProgress();
    }
  }, [todayGoalData, userData, loadWorkoutProgress]);

  // Handlers cho các actions
  const handleStartWorkout = () => {
    router.push('/add-workout');
  };

  const handleAddCustomer = () => {
    setShowCustomerModal(true);
  };

  const handleAddEmployee = () => {
    setShowEmployeeModal(true);
  };

  const handleCustomerSave = (result) => {
    console.log('Customer saved:', result);
    setShowCustomerModal(false);
    // Reload data để cập nhật số lượng
    loadRealData();
  };

  const handleEmployeeSave = (result) => {
    console.log('Employee saved:', result);
    setShowEmployeeModal(false);
    // Reload data để cập nhật số lượng
    loadRealData();
  };

  const renderGoalModal = () => (
    <Modal
      visible={showGoalModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? Colors.darkCard : 'white' }]}>
          <View style={styles.modalHeader}>
            <Ionicons name="target" size={32} color="#667eea" />
            <Title style={[styles.modalTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Chọn mục tiêu tập hôm nay
            </Title>
          </View>

          {/* Goal History Chart */}
          <View style={styles.historySection}>
            <Text style={[styles.historyTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Tiến độ 7 ngày qua
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyChart}>
              {goalHistory.map((day, index) => {
                const dayName = new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short' });
                const isToday = index === goalHistory.length - 1;
                
                return (
                  <View key={index} style={styles.historyItem}>
                    <View style={[
                      styles.historyBar,
                      {
                        height: Math.max(20, (day.completed / Math.max(day.goal, 1)) * 60),
                        backgroundColor: day.achieved ? '#4CAF50' : (day.completed > 0 ? '#FFC107' : '#E0E0E0')
                      }
                    ]}>
                      {day.achieved && (
                        <Ionicons name="checkmark" size={12} color="white" style={styles.checkIcon} />
                      )}
                    </View>
                    <Text style={[styles.historyDay, { 
                      color: isToday ? '#667eea' : (isDarkMode ? Colors.darkText : Colors.gray),
                      fontWeight: isToday ? 'bold' : 'normal'
                    }]}>
                      {dayName}
                    </Text>
                    <Text style={[styles.historyValue, { color: isDarkMode ? Colors.darkText : Colors.gray }]}>
                      {day.completed}/{day.goal}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* Streak Info */}
          <View style={styles.streakInfo}>
            <View style={styles.streakItem}>
              <Ionicons name="flame" size={24} color="#FF6B35" />
              <Text style={[styles.streakText, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
                Chuỗi: {currentStreak} ngày
              </Text>
            </View>
          </View>

          {/* Goal Input */}
          <View style={styles.goalInput}>
            <Text style={[styles.inputLabel, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Mục tiêu hôm nay (phút):
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? Colors.darkBackground : '#f5f5f5',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]}
              value={dailyGoal}
              onChangeText={setDailyGoal}
              placeholder="Nhập số phút..."
              placeholderTextColor={isDarkMode ? Colors.darkText + '80' : Colors.gray}
              keyboardType="numeric"
            />
          </View>

          {/* Reminder Text */}
          <View style={styles.reminderBox}>
            <Ionicons name="bulb" size={20} color="#FFC107" />
            <Text style={[styles.reminderText, { color: isDarkMode ? Colors.darkText : Colors.gray }]}>
              Bạn có chắc chắn với mục tiêu này không? Hãy thiết lập một mục tiêu thực tế để duy trì động lực!
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.confirmButton} onPress={saveGoal}>
              <Text style={styles.confirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      {renderGoalModal()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Card style={[styles.heroCard, { backgroundColor: '#667eea' }]}>
          <Card.Content>
            <Title style={styles.heroTitle}>Chào {userData?.ten}! 👋</Title>
            <Paragraph style={styles.heroText}>
              Hãy bắt đầu hành trình của bạn ngay hôm nay!
            </Paragraph>
            <View style={styles.statsGrid}>
              {data.map((item, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
            Hành Động Nhanh
          </Title>
          <View style={styles.quickActions}>
            {/* Nút Bắt Đầu Tập - hiển thị cho tất cả */}
            <TouchableOpacity style={styles.actionCard} onPress={handleStartWorkout}>
              <View style={[styles.actionIcon, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="play-circle" size={24} color="#ef4444" />
              </View>
              <View>
                <Text style={styles.actionTitle}>Bắt Đầu Tập</Text>
                <Text style={styles.actionSubtitle}>Workout mới</Text>
              </View>
            </TouchableOpacity>
            
            {/* Nút Thêm Khách hàng - hiển thị cho Business và Employee */}
            {(isBusiness || isEmployee) && (
              <TouchableOpacity style={styles.actionCard} onPress={handleAddCustomer}>
                <View style={[styles.actionIcon, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="person-add" size={24} color="#0288d1" />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Thêm Khách Hàng</Text>
                  <Text style={styles.actionSubtitle}>Khách hàng mới</Text>
                </View>
              </TouchableOpacity>
            )}
            
            {/* Nút Thêm Nhân viên - chỉ hiển thị cho Business */}
            {isBusiness && (
              <TouchableOpacity style={styles.actionCard} onPress={handleAddEmployee}>
                <View style={[styles.actionIcon, { backgroundColor: '#f3e5f5' }]}>
                  <Ionicons name="people" size={24} color="#7b1fa2" />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Thêm Nhân Viên</Text>
                  <Text style={styles.actionSubtitle}>Nhân viên mới</Text>
                </View>
              </TouchableOpacity>
            )}
            
            {/* Nút Thêm Lịch hẹn - chỉ hiển thị cho Employee */}
            {isEmployee && (
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: '#e8f5e8' }]}>
                  <Ionicons name="calendar" size={24} color="#2e7d32" />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Thêm Lịch Hẹn</Text>
                  <Text style={styles.actionSubtitle}>Lịch hẹn mới</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Today's Progress - chỉ hiển thị cho Personal users */}
        {isPersonal && (
          <View style={styles.section}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Tiến Độ Hôm Nay
            </Title>
            <View style={styles.progressGrid}>
              <Card style={styles.progressCard}>
                <View style={styles.progressContent}>
                  <ProgressCircle
                    size={60}
                    progress={goalProgress}
                    color="#4ECDC4"
                    thickness={8}
                  />
                  <View style={styles.progressText}>
                    <Text style={styles.progressLabel}>Thời Gian Tập</Text>
                    <Text style={styles.progressValue}>
                      {totalWorkoutTime} / {todayGoalData?.muctieu || 0} phút
                    </Text>
                  </View>
                </View>
              </Card>
              
              <Card style={styles.progressCard}>
                <View style={styles.progressContent}>
                  <View style={styles.streakDisplay}>
                    <Ionicons name="flame" size={40} color="#FF6B35" />
                    <Text style={styles.streakNumber}>{currentStreak}</Text>
                  </View>
                  <View style={styles.progressText}>
                    <Text style={styles.progressLabel}>Chuỗi Ngày</Text>
                    <Text style={styles.progressValue}>Hoàn thành</Text>
                  </View>
                </View>
              </Card>
            </View>
          </View>
        )}

        {/* Upcoming Appointments - hiển thị cho Business và Employee */}
        {(isBusiness || isEmployee) && (
          <View style={styles.section}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Các Lịch Hẹn Sắp Tới
            </Title>
            <View style={styles.appointmentsGrid}>
              <Card style={styles.appointmentCard}>
                <View style={styles.appointmentContent}>
                  <View style={styles.appointmentIcon}>
                    <Ionicons name="calendar-outline" size={24} color="#667eea" />
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentTitle}>Nguyễn Văn An</Text>
                    <Text style={styles.appointmentTime}>10:00 - Hôm nay</Text>
                    <Text style={styles.appointmentType}>Personal Training</Text>
                  </View>
                </View>
              </Card>
              
              <Card style={styles.appointmentCard}>
                <View style={styles.appointmentContent}>
                  <View style={styles.appointmentIcon}>
                    <Ionicons name="calendar-outline" size={24} color="#ff6b35" />
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentTitle}>Trần Thị Bình</Text>
                    <Text style={styles.appointmentTime}>14:30 - Hôm nay</Text>
                    <Text style={styles.appointmentType}>Group Class</Text>
                  </View>
                </View>
              </Card>
            </View>
          </View>
        )}

      </ScrollView>
      
      {/* Customer Form Modal */}
      {showCustomerModal && (
        <CustomerFormModal
          visible={showCustomerModal}
          customer={null} // null for new customer
          isDarkMode={isDarkMode}
          onClose={() => setShowCustomerModal(false)}
          onSave={handleCustomerSave}
        />
      )}

      {/* Employee Form Modal */}
      {showEmployeeModal && (
        <EmployeeFormModal
          visible={showEmployeeModal}
          employee={null} // null for new employee
          isDarkMode={isDarkMode}
          userData={userData}
          onClose={() => setShowEmployeeModal(false)}
          onSave={handleEmployeeSave}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48, // Account for status bar
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // Same width as back button for centering
  },
  scrollView: {
    flex: 1,
  },
  heroCard: {
    margin: 16,
    borderRadius: 12,
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    marginBottom: 8,
  },
  branchInfo: {
    color: 'white',
    opacity: 0.95,
    fontSize: 16,
    marginBottom: 4,
  },
  heroText: {
    color: 'white',
    opacity: 0.9,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    opacity: 0.8,
    fontSize: 12,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'column',
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    width: '100%',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionSubtitle: {
    color: 'gray',
    fontSize: 14,
  },
  progressGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressText: {
    marginTop: 8,
    alignItems: 'center',
  },
  progressLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressValue: {
    color: 'gray',
    fontSize: 12,
  },
  streakDisplay: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    position: 'absolute',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Appointments Styles
  appointmentsGrid: {
    gap: 12,
  },
  appointmentCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 8,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  appointmentTime: {
    color: '#667eea',
    fontSize: 14,
    marginBottom: 2,
  },
  appointmentType: {
    color: 'gray',
    fontSize: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  historySection: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  historyChart: {
    flexDirection: 'row',
  },
  historyItem: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 40,
  },
  historyBar: {
    width: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 2,
  },
  checkIcon: {
    marginBottom: 2,
  },
  historyDay: {
    fontSize: 12,
    marginBottom: 2,
  },
  historyValue: {
    fontSize: 10,
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalInput: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  reminderBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  reminderText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});