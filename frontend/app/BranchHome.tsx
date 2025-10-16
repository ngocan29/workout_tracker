import React, { useState, useEffect } from 'react'; // Nhập React và useState để quản lý trạng thái
import { View, StyleSheet } from 'react-native'; // Nhập các thành phần giao diện
import AsyncStorage from '@react-native-async-storage/async-storage'; // Nhập AsyncStorage để lưu trữ
import { useLocalSearchParams } from 'expo-router'; // Nhập useLocalSearchParams để lấy params
import HomeScreen from '../screens/HomeScreen'; // Nhập HomeScreen component
import WorkoutScreen from '../screens/WorkoutScreen'; // Nhập WorkoutScreen component
import NutritionScreen from '../screens/NutritionScreen'; // Nhập NutritionScreen component  
import ProgressScreen from '../screens/ProgressScreen'; // Nhập ProgressScreen component
import ProfileScreen from '../screens/ProfileScreen'; // Nhập ProfileScreen component
import EditProfileScreen from '../screens/EditProfileScreen'; // Nhập EditProfileScreen component
import CustomersScreen from '../screens/CustomersScreen'; // Nhập CustomersScreen component
import EmployeesScreen from '../screens/EmployeesScreen'; // Nhập EmployeesScreen component
import BottomTabBar from '../components/BottomTabBar'; // Nhập Bottom Tab Bar component

export default function BranchHome() {
  const { branchData, userData } = useLocalSearchParams(); // Lấy dữ liệu chi nhánh và người dùng từ params
  const parsedBranchData = branchData && typeof branchData === 'string' ? JSON.parse(branchData) : null; // Parse dữ liệu chi nhánh
  const parsedUserData = userData && typeof userData === 'string' ? JSON.parse(userData) : null; // Parse dữ liệu người dùng
  
  const [currentScreen, setCurrentScreen] = useState('home'); // State quản lý màn hình hiện tại
  const [isDarkMode, setIsDarkMode] = useState(false); // State quản lý dark mode
  
  // Kiểm tra loại tài khoản business (support cả format cũ và mới)
  const isBusiness = parsedUserData?.loaitaikhoan === 'business' || parsedUserData?.loai_tai_khoan === 'business';
  
  // Debug log
  console.log('BranchHome - parsedUserData:', parsedUserData);
  console.log('BranchHome - isBusiness:', isBusiness);

  // Load dark mode state từ AsyncStorage khi component mount
  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
        if (savedDarkMode !== null) {
          setIsDarkMode(JSON.parse(savedDarkMode));
        }
      } catch (error) {
        console.log('Error loading dark mode:', error);
      }
    };
    loadDarkMode();
  }, []);

  // Save dark mode state khi thay đổi
  const handleToggleDarkMode = async (newValue: boolean) => {
    try {
      setIsDarkMode(newValue);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newValue));
    } catch (error) {
      console.log('Error saving dark mode:', error);
    }
  };

  // Mock navigation object cho các screen cần navigation prop
  const mockNavigation = {
    navigate: (screenName: string) => {
      // Mock navigation - có thể mở rộng sau
      console.log('Navigate to:', screenName);
    }
  };

  // Hàm render màn hình dựa trên tab được chọn
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
          />
        );
      case 'workout':
        return (
          <WorkoutScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
            navigation={mockNavigation}
          />
        );
      case 'nutrition':
        return (
          <NutritionScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
          />
        );
      case 'progress':
        return (
          <ProgressScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
          />
        );
      case 'customers':
        return (
          <CustomersScreen 
            isDarkMode={isDarkMode}
          />
        );
      case 'employees':
        return (
          <EmployeesScreen 
            isDarkMode={isDarkMode}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'editProfile':
        return <EditProfileScreen setCurrentScreen={setCurrentScreen} />; // Render EditProfileScreen với navigation callback
      default:
        return (
          <HomeScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
          />
        );
    }
  };

  return (
    <View style={styles.container}> {/* Container chính */}
      {renderScreen()} {/* Render màn hình hiện tại */}
      {/* Chỉ hiển thị BottomTabBar khi không ở trang EditProfile */}
      {currentScreen !== 'editProfile' && (
        <BottomTabBar 
          currentScreen={currentScreen} // Truyền màn hình hiện tại
          setCurrentScreen={setCurrentScreen} // Truyền hàm thay đổi màn hình
          branchName={parsedBranchData?.ten} // Truyền tên chi nhánh để hiển thị
          isDarkMode={isDarkMode} // Truyền dark mode state
          isBusiness={isBusiness} // Truyền trạng thái business user
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({ // Style cho component
  container: { // Container toàn màn hình
    flex: 1,
    backgroundColor: '#f8fafc'
  }
});