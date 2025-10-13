import React from 'react'; // Nhập React để xây dựng giao diện
import { NavigationContainer } from '@react-navigation/native'; // Nhập NavigationContainer để quản lý điều hướng
import { Stack } from 'expo-router'; // Nhập Stack từ expo-router

export default function App() {
  return (
    <NavigationContainer independent={true}> {/* NavigationContainer độc lập */}
      <Stack initialRouteName="index"> {/* Khởi tạo stack với màn hình gốc là index */}
        <Stack.Screen name="index" options={{ headerShown: false }} /> {/* Màn hình gốc */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> {/* Nhóm tab */}
        <Stack.Screen name="EditProfile" options={{ headerShown: true, title: 'Chỉnh sửa hồ sơ' }} /> {/* Màn hình chỉnh sửa hồ sơ */}
        <Stack.Screen name="Register" options={{ headerShown: false }} /> {/* Màn hình đăng ký */}
      </Stack>
    </NavigationContainer> // Kết thúc NavigationContainer
  );
}