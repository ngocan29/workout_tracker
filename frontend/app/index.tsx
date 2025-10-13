import React, { useState, useEffect } from 'react'; // Nhập React, useState, useEffect để quản lý trạng thái đăng nhập
import { View, Text, StyleSheet } from 'react-native'; // Nhập các thành phần giao diện
import { Redirect } from 'expo-router'; // Nhập Redirect để chuyển hướng
import { Colors } from '../app-example/constants/Colors'; // Nhập Colors để sử dụng màu sắc
import LoginScreen from '../screens/LoginScreen'; // Nhập LoginScreen để hiển thị nếu chưa đăng nhập

// Placeholder cho AuthService
const AuthService = {
  getCurrentUser: async () => { return null; }, // Giả lập kiểm tra trạng thái đăng nhập
};

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Trạng thái xác thực người dùng
  const [loading, setLoading] = useState(true); // Trạng thái tải

  useEffect(() => { // Kiểm tra trạng thái đăng nhập khi màn hình khởi tạo
    const checkAuth = async () => {
      const user = await AuthService.getCurrentUser(); // Gọi API kiểm tra user
      setIsAuthenticated(!!user); // Cập nhật trạng thái đăng nhập
      setLoading(false); // Kết thúc trạng thái tải
    };
    checkAuth();
  }, []); // Chỉ chạy một lần khi mount

  if (loading) { // Nếu đang tải, hiển thị màn hình loading
    return (
      <View style={styles.container}> {/* Container chính cho loading */}
        <Text style={styles.loadingText}>Đang tải...</Text> {/* Văn bản loading */}
      </View>
    );
  }

  if (isAuthenticated) { // Nếu đã đăng nhập, chuyển hướng đến tabs
    return <Redirect href="/" />; // Chuyển hướng đến root (Đã_đăng_nhập)
  }

  return <LoginScreen />; // Nếu chưa đăng nhập, hiển thị LoginScreen (Chưa_đăng_nhập)
}

const styles = StyleSheet.create({ // Style cho giao diện
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }, // Container căn giữa, nền trắng
  loadingText: { fontSize: 16, color: Colors.gray }, // Style văn bản loading
});