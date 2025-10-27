import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../../src/screens/HomeScreen';
import WorkoutScreen from '../../src/screens/WorkoutScreen';
import NutritionScreen from '../../src/screens/NutritionScreen';
import ProgressScreen from '../../src/screens/ProgressScreen';
import ProfileScreen from '../../src/screens/ProfileScreen';
import EditProfileScreen from '../../src/screens/EditProfileScreen';
import ContactScreen from '../../src/screens/ContactScreen';
import CustomersScreen from '../../src/screens/CustomersScreen';
import EmployeesScreen from '../../src/screens/EmployeesScreen';
import LichHenScreen from '../../src/screens/LichHenScreen';
import BottomTabBar from '../../src/components/ui/BottomTabBar';

export default function TabsLayout() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [branchData, setBranchData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data and dark mode state
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedUserData, savedDarkMode] = await Promise.all([
          AsyncStorage.getItem('userData'),
          AsyncStorage.getItem('isDarkMode')
        ]);
        
        console.log('TabsLayout - Loading data...');
        console.log('Raw savedUserData:', savedUserData);
        
        if (savedUserData) {
          const parsedUserData = JSON.parse(savedUserData);
          console.log('TabsLayout - Parsed userData:', parsedUserData);
          setUserData(parsedUserData);
        }
        
        if (savedDarkMode !== null) {
          setIsDarkMode(JSON.parse(savedDarkMode));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.log('Error loading data:', error);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save dark mode state when changed
  const handleToggleDarkMode = async (newValue: boolean) => {
    try {
      setIsDarkMode(newValue);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newValue));
    } catch (error) {
      console.log('Error saving dark mode:', error);
    }
  };

  // Detect user role from userData
  const getUserRole = () => {
    if (!userData) {
      console.log('No userData, defaulting to khachhang');
      return 'khachhang'; // Default fallback
    }
    
    console.log('getUserRole - userData:', {
      loai_tai_khoan: userData.loai_tai_khoan,
      additional_info: userData.additional_info
    });
    
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
        return 'personal'; // TH2: Personal not under any branch (or undefined additional_info)
      }
    }
    
    return 'khachhang'; // Default fallback
  };

  const userRole = getUserRole();

  // Show loading while userData is being loaded
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Đang tải...</Text>
      </View>
    );
  }

  // Render screen based on current tab and user role
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
            branchData={branchData}
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
            branchData={branchData}
          />
        );
      case 'editProfile':
        return <EditProfileScreen setCurrentScreen={setCurrentScreen} userData={userData} branchData={branchData} />;
      case 'contact':
        return (
          <ContactScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
            setCurrentScreen={setCurrentScreen}
            userData={userData}
            branchData={branchData}
          />
        );
      default:
        return (
          <HomeScreen 
            isDarkMode={isDarkMode} 
            setDarkMode={handleToggleDarkMode}
            branchData={branchData}
            userData={userData}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {renderScreen()}
      {/* Only show BottomTabBar when not on EditProfile or Contact */}
      {currentScreen !== 'editProfile' && currentScreen !== 'contact' && (
        <BottomTabBar 
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          branchName={branchData?.ten}
          isDarkMode={isDarkMode}
          userRole={userRole}
        />
      )}
    </View>
  );
}