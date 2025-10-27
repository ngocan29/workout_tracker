import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Title, Button } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MoreVertical, Edit, Trash2 } from 'react-native-feather';
import { useRouter } from 'expo-router';
import Navbar from '../components/ui/Navbar';
import { Colors } from '../constants/Colors';
import { WorkoutService } from '../services/api';

export default function WorkoutScreen({ isDarkMode, setDarkMode }) {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const workoutData = [
    {
      id: 1,
      name: "Cardio Buổi Sáng",
      duration: "30 phút",
      calories: 250,
      completed: true,
      image: "https://via.placeholder.com/300x200/FF6B6B/white?text=Cardio",
    },
    {
      id: 2,
      name: "Tập Tạ Cơ Bản",
      duration: "45 phút",
      calories: 300,
      completed: false,
      image: "https://via.placeholder.com/300x200/4ECDC4/white?text=Weight",
    },
    {
      id: 3,
      name: "Yoga Thư Giãn",
      duration: "60 phút",
      calories: 150,
      completed: false,
      image: "https://via.placeholder.com/300x200/9B59B6/white?text=Yoga",
    },
    {
      id: 4,
      name: "HIIT Cường Độ Cao",
      duration: "20 phút",
      calories: 200,
      completed: false,
      image: "https://via.placeholder.com/300x200/F39C12/white?text=HIIT",
    },
  ];

  const categories = [
    { name: "Cardio", color: "#FF6B6B" },
    { name: "Tạ", color: "#4ECDC4" },
    { name: "Yoga", color: "#9B59B6" },
    { name: "HIIT", color: "#F39C12" },
  ];

  const toggleDropdown = (workoutId) => {
    setActiveDropdown(activeDropdown === workoutId ? null : workoutId);
  };

  const handleEditWorkout = (workout) => {
    setActiveDropdown(null);
    router.push({
      pathname: '/add-workout',
      params: {
        editMode: 'true',
        workoutData: JSON.stringify(workout)
      }
    });
  };

  const handleDeleteWorkout = async (workout) => {
    setActiveDropdown(null);
    Alert.alert(
      'Xóa bài tập',
      `Bạn có chắc chắn muốn xóa bài tập "${workout.name}" không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await WorkoutService.deleteWorkout(workout.id);
              Alert.alert('Thành công', 'Bài tập đã được xóa!');
              // TODO: Refresh workout list
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa bài tập');
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}
      activeOpacity={1}
      onPress={() => setActiveDropdown(null)}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      <ScrollView style={styles.scrollView}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Tìm kiếm bài tập...</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
            Danh Mục Tập Luyện
          </Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryRow}>
              {categories.map((category, index) => (
                <TouchableOpacity key={index} style={styles.categoryCard}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Text style={[styles.categoryEmoji]}>🏃</Text>
                  </View>
                  <Text style={[styles.categoryName, { color: category.color }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* My Workouts | Tự tạo*/}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Bài Tập Của Tôi
            </Title>
            <Button 
              mode="contained" 
              style={styles.addButton}
              onPress={() => router.push('/add-workout')}
            >
              Thêm Mới
            </Button>
          </View>
          {workoutData.map((workout) => (
            <View key={workout.id} style={styles.workoutCard}>
              <TouchableOpacity
                style={styles.workoutCardContent}
                onPress={() => router.push({ 
                  pathname: '/workout-detail', 
                  params: { 
                    workoutId: workout.id.toString(),
                    workoutName: workout.name 
                  } 
                })}
              >
                <Image source={{ uri: workout.image }} style={styles.workoutImage} />
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <View style={styles.workoutDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={16} color="gray" />
                      <Text style={styles.detailText}>{workout.duration}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="flame-outline" size={16} color="gray" />
                      <Text style={styles.detailText}>{workout.calories} calo</Text>
                    </View>
                  </View>
                  <Button
                    mode={workout.completed ? "outlined" : "contained"}
                    style={styles.workoutButton}
                  >
                    {workout.completed ? "Hoàn Thành" : "Bắt Đầu"}
                  </Button>
                </View>
              </TouchableOpacity>
              
              {/* Menu 3 chấm */}
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => toggleDropdown(workout.id)}
                >
                  <MoreVertical stroke="#666" width={20} height={20} />
                </TouchableOpacity>
                
                {activeDropdown === workout.id && (
                  <View style={styles.dropdown}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleEditWorkout(workout)}
                    >
                      <Edit stroke="#666" width={16} height={16} />
                      <Text style={styles.dropdownText}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleDeleteWorkout(workout)}
                    >
                      <Trash2 stroke="#e74c3c" width={16} height={16} />
                      <Text style={[styles.dropdownText, { color: '#e74c3c' }]}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Public Workouts | Của công ty hoặc Nhân viên nên Personal sẽ bỏ phần này */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Bài Tập Khác
            </Title>
          </View>
          {workoutData.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => router.push({ 
                pathname: '/workout-detail', 
                params: { 
                  workoutId: workout.id.toString(),
                  workoutName: workout.name 
                } 
              })}
            >
              <Image source={{ uri: workout.image }} style={styles.workoutImage} />
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <View style={styles.workoutDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color="gray" />
                    <Text style={styles.detailText}>{workout.duration}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="flame-outline" size={16} color="gray" />
                    <Text style={styles.detailText}>{workout.calories} calo</Text>
                  </View>
                </View>
                <Button
                  mode={workout.completed ? "outlined" : "contained"}
                  style={styles.workoutButton}
                >
                  {workout.completed ? "Hoàn Thành" : "Bắt Đầu"}
                </Button>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  searchContainer: { margin: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchPlaceholder: { flex: 1, color: 'gray' },
  section: { marginHorizontal: 16, marginVertical: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18 },
  categoryRow: { flexDirection: 'row', gap: 12, paddingVertical: 8 },
  categoryCard: { alignItems: 'center', padding: 8 },
  categoryIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  categoryEmoji: { fontSize: 20 },
  categoryName: { fontWeight: 'bold', marginTop: 4 },
  workoutCard: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 12, 
    elevation: 2,
    position: 'relative',
  },
  workoutCardContent: { 
    flex: 1, 
    flexDirection: 'row' 
  },
  menuContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 120,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  workoutImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  workoutInfo: { flex: 1 },
  workoutName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  workoutDetails: { flexDirection: 'row', marginBottom: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  detailText: { marginLeft: 4, color: 'gray' },
  workoutButton: { marginTop: 4 },
  addButton: { borderRadius: 8 },
});