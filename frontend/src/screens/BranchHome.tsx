import React, { useState, useEffect } from 'react'; // Nhập React và useState để quản lý trạng thái
import { View, StyleSheet } from 'react-native'; // Nhập các thành phần giao diện
import AsyncStorage from '@react-native-async-storage/async-storage'; // Nhập AsyncStorage để lưu trữ
import { useLocalSearchParams } from 'expo-router'; // Nhập useLocalSearchParams để lấy params
import HomeScreen from './HomeScreen'; // Nhập HomeScreen component
import WorkoutScreen from './WorkoutScreen'; // Nhập WorkoutScreen component
import NutritionScreen from './NutritionScreen'; // Nhập NutritionScreen component  
import ProgressScreen from './ProgressScreen'; // Nhập ProgressScreen component
import ProfileScreen from './ProfileScreen'; // Nhập ProfileScreen component
import EditProfileScreen from './EditProfileScreen'; // Nhập EditProfileScreen component
import CustomersScreen from './CustomersScreen'; // Nhập CustomersScreen component
import EmployeesScreen from './EmployeesScreen'; // Nhập EmployeesScreen component
import LichHenScreen from './LichHenScreen'; // Nhập LichHenScreen component
import ContactScreen from './ContactScreen'; // Nhập ContactScreen component
import BottomTabBar from '../components/ui/BottomTabBar'; // Nhập Bottom Tab Bar component

export default function BranchHome() {
  const { branchData } = useLocalSearchParams(); // Lấy dữ liệu chi nhánh từ params
  const parsedBranchData = branchData && typeof branchData === 'string' ? JSON.parse(branchData) : null; // Parse dữ liệu chi nhánh
  
  const [currentScreen, setCurrentScreen] = useState('home'); // State quản lý màn hình hiện tại
  const [isDarkMode, setIsDarkMode] = useState(false); // State quản lý dark mode
  const [userData, setUserData] = useState(null); // State quản lý user data
  
  // Load user data từ AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem('userData');
        if (savedUserData) {
          const parsedUserData = JSON.parse(savedUserData);
          setUserData(parsedUserData);
          console.log('BranchHome - loaded userData:', parsedUserData);
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);
  
  // Detect user role from userData
  const getUserRole = () => {
    if (!userData) return 'khachhang'; // Default fallback
    
    // TH1: Business user
    if (userData.loai_tai_khoan === 'business') {
      return 'business';
    }
    
    // TH2, TH3, TH4: Personal users with different roles
    if (userData.loai_tai_khoan === 'personal') {
      const additionalInfo = userData.additional_info;
      
      if (additionalInfo && additionalInfo.vai_tro === 'nhanvien') {
        return 'nhanvien'; // TH4: Employee
      } else if (additionalInfo && additionalInfo.vai_tro === 'khachhang') {
        return 'khachhang'; // TH3: Customer under branch
      } else {
        return 'personal'; // TH2: Personal not under any branch
      }
    }
    
    return 'khachhang'; // Default fallback
  };
  
  const userRole = getUserRole();
  
  // Kiểm tra loại tài khoản business (support cả format cũ và mới) - for backwards compatibility
  const isBusiness = userData?.loaitaikhoan === 'business' || userData?.loai_tai_khoan === 'business';
  
  // Debug log
  console.log('BranchHome - userData:', userData);
  console.log('BranchHome - userRole:', userRole);
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

  // Hàm render màn hình dựa trên tab được chọn và user role
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
            branchData={parsedBranchData}
            userData={userData}
          />
        );
      case 'workout':
        return (
          <WorkoutScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
          />
        );
      case 'nutrition':
        // Only show for personal, khachhang (not business or nhanvien)
        return (
          <NutritionScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
          />
        );
      case 'progress':
        // Only show for personal, khachhang (not business or nhanvien)
        return (
          <ProgressScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
          />
        );
      case 'customers':
        // Only show for business and nhanvien
        return (
          <CustomersScreen 
            isDarkMode={isDarkMode}
            userRole={userRole}
          />
        );
      case 'employees':
        // Only show for business
        return (
          <EmployeesScreen 
            isDarkMode={isDarkMode}
          />
        );
      case 'lichhen':
        // Only show for nhanvien
        return (
          <LichHenScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
            setCurrentScreen={setCurrentScreen}
            userRole={userRole}
            userData={userData}
            branchData={parsedBranchData}
          />
        );
      case 'editProfile':
        return (
          <EditProfileScreen 
            setCurrentScreen={setCurrentScreen}
            userData={userData}
            branchData={parsedBranchData}
          />
        ); // Render EditProfileScreen với navigation callback
      case 'contact':
        return (
          <ContactScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
            setCurrentScreen={setCurrentScreen}
            userData={userData}
            branchData={parsedBranchData}
          />
        ); // Render ContactScreen với navigation callback
      default:
        return (
          <HomeScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
            branchData={parsedBranchData}
            userData={userData}
          />
        );
    }
  };

  return (
    <View style={styles.container}> {/* Container chính */}
      {renderScreen()} {/* Render màn hình hiện tại */}
      {/* Chỉ hiển thị BottomTabBar khi không ở trang EditProfile hoặc Contact */}
      {currentScreen !== 'editProfile' && currentScreen !== 'contact' && (
        <BottomTabBar 
          currentScreen={currentScreen} // Truyền màn hình hiện tại
          setCurrentScreen={setCurrentScreen} // Truyền hàm thay đổi màn hình
          branchName={parsedBranchData?.ten} // Truyền tên chi nhánh để hiển thị
          isDarkMode={isDarkMode} // Truyền dark mode state
          userRole={userRole} // Truyền user role để xác định tabs hiển thị
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