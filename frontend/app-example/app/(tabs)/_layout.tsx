import { Tabs } from 'expo-router'; // Nhập Tabs từ expo-router để tạo tab navigation
import { Colors } from '../../constants/Colors'; // Nhập Colors để sử dụng màu sắc thống nhất
import TabBar from '../../components/ui/TabBar'; // Nhập TabBar component tùy chỉnh

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <TabBar />} // Sử dụng TabBar tùy chỉnh cho giao diện tab
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary }, // Style header với màu primary
        headerTintColor: Colors.white, // Màu chữ header
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} /> {/* Màn hình mặc định */}
      <Tabs.Screen name="explore" options={{ headerShown: false }} /> {/* Màn hình explore */}
      <Tabs.Screen name="HomeTab" options={{ headerShown: false }} /> {/* Màn hình HomeTab, ánh xạ tới file HomeTab.js */}
      <Tabs.Screen name="NutritionTab" options={{ headerShown: false }} /> {/* Màn hình NutritionTab */}
      <Tabs.Screen name="ProfileTab" options={{ headerShown: false }} /> {/* Màn hình ProfileTab */}
      <Tabs.Screen name="ProgressTab" options={{ headerShown: false }} /> {/* Màn hình ProgressTab */}
      <Tabs.Screen name="WorkoutTab" options={{ headerShown: false }} /> {/* Màn hình WorkoutTab */}
    </Tabs> // Kết thúc Tabs
  );
}