import React from 'react'; // Nhập React
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'; // Nhập các thành phần giao diện
import { Ionicons } from '@expo/vector-icons'; // Nhập Ionicons cho icon
import { Colors } from '../../constants/Colors'; // Import Colors

export default function BottomTabBar({ currentScreen, setCurrentScreen, branchName, isDarkMode, userRole }) {
  // Determine tabs based on user role
  const getTabsForRole = () => {
    // TH1: Business user
    if (userRole === 'business') {
      return [
        { key: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Trang Chủ' },
        { key: 'workout', icon: 'fitness-outline', activeIcon: 'fitness', label: 'Tập Luyện' },
        { key: 'customers', icon: 'people-outline', activeIcon: 'people', label: 'Khách hàng' },
        { key: 'employees', icon: 'person-add-outline', activeIcon: 'person-add', label: 'Nhân viên' },
        { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Hồ Sơ' },
      ];
    }
    
    // TH4: Nhân viên
    if (userRole === 'nhanvien') {
      return [
        { key: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Trang Chủ' },
        { key: 'workout', icon: 'fitness-outline', activeIcon: 'fitness', label: 'Tập Luyện' },
        { key: 'customers', icon: 'people-outline', activeIcon: 'people', label: 'Khách hàng' },
        { key: 'lichhen', icon: 'calendar-outline', activeIcon: 'calendar', label: 'Lịch hẹn' },
        { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Hồ Sơ' },
      ];
    }
    
    // TH2: Personal user (không thuộc chi nhánh)
    if (userRole === 'personal') {
      return [
        { key: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Trang Chủ' },
        { key: 'workout', icon: 'fitness-outline', activeIcon: 'fitness', label: 'Tập Luyện' },
        { key: 'nutrition', icon: 'restaurant-outline', activeIcon: 'restaurant', label: 'Dinh Dưỡng' },
        { key: 'progress', icon: 'trending-up-outline', activeIcon: 'trending-up', label: 'Tiến Độ' },
        { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Hồ Sơ' },
      ];
    }
    
    // TH3: Khách hàng (default) - và fallback cho các trường hợp khác
    return [
      { key: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Trang Chủ' },
      { key: 'workout', icon: 'fitness-outline', activeIcon: 'fitness', label: 'Tập Luyện' },
      { key: 'nutrition', icon: 'restaurant-outline', activeIcon: 'restaurant', label: 'Dinh Dưỡng' },
      { key: 'progress', icon: 'trending-up-outline', activeIcon: 'trending-up', label: 'Tiến Độ' },
      { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Hồ Sơ' },
    ];
  };

  const tabs = getTabsForRole();

  return (
    <View style={[styles.container, { 
      backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
      borderTopColor: isDarkMode ? Colors.darkBackground : '#e5e5e5'
    }]}> {/* Container cho bottom tab bar */}
      {/* Header hiển thị tên chi nhánh */}
      {branchName && (
        <View style={[styles.header, {
          backgroundColor: isDarkMode ? Colors.darkBackground : '#f8fafc',
          borderBottomColor: isDarkMode ? Colors.darkSurface : '#e5e5e5'
        }]}>
          <Text style={[styles.branchName, {
            color: isDarkMode ? Colors.darkText : '#374151'
          }]}>📍 {branchName}</Text> {/* Hiển thị tên chi nhánh với icon */}
        </View>
      )}
      
      {/* Danh sách các tab */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.key; // Kiểm tra tab có đang active không
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab, 
                isActive && {
                  backgroundColor: isDarkMode ? Colors.darkBackground : '#ede9fe'
                }
              ]} // Style tab với highlight khi active
              onPress={() => setCurrentScreen(tab.key)} // Thay đổi màn hình khi nhấn tab
              activeOpacity={0.7} // Hiệu ứng nhấn
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon} // Icon thay đổi khi active
                size={24}
                color={isActive ? (isDarkMode ? Colors.darkGreen : Colors.darkGreen) : (isDarkMode ? Colors.darkSecondary : '#8e8e93')} // Màu icon thay đổi khi active
              />
              <Text style={[
                styles.tabLabel, 
                isActive && styles.activeTabLabel,
                { color: isActive ? (isDarkMode ? Colors.darkGreen : Colors.darkGreen) : (isDarkMode ? Colors.darkSecondary : '#8e8e93') }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ // Style cho bottom tab bar
  container: { // Container chính
    borderTopWidth: 1,
    paddingBottom: 20, // Padding cho safe area
  },
  header: { // Header hiển thị tên chi nhánh
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  branchName: { // Style cho tên chi nhánh
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabContainer: { // Container cho các tab
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  tab: { // Style cho mỗi tab
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  tabLabel: { // Style cho label tab
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeTabLabel: { // Style cho label tab active
    fontWeight: '600',
  },
});