import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../app-example/components/ui/Navbar';
import { Colors } from '../app-example/constants/Colors';

export default function WorkoutScreen({ isDarkMode, setDarkMode, navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu từ backend
  useEffect(() => {
    fetch('http://192.168.1.19:5000/baitap') // Thay IP_MAY_TINH bằng IP thật của máy backend
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi tải dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  const categories = [
    { name: "Cardio", color: "#FF6B6B" },
    { name: "Tạ", color: "#4ECDC4" },
    { name: "Yoga", color: "#9B59B6" },
    { name: "HIIT", color: "#F39C12" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
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
                    <Text style={styles.categoryEmoji}>🏃</Text>
                  </View>
                  <Text style={[styles.categoryName, { color: category.color }]}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Workouts from Backend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Bài Tập Hôm Nay
            </Title>
            <Button
              mode="contained"
              style={styles.addButton}
              onPress={() => navigation.navigate('AddWorkout')}
            >
              Thêm Mới
            </Button>

          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#FF6B6B" />
          ) : workouts.length === 0 ? (
            <Text style={{ textAlign: 'center', color: 'gray' }}>Chưa có bài tập nào.</Text>
          ) : (
            workouts.map((workout) => (
              <TouchableOpacity
                key={workout._id}
                style={styles.workoutCard}
                onPress={() => navigation.navigate('WorkoutDetail', { workout })}
              >
                <Image
                  source={{ uri: workout.image || 'https://via.placeholder.com/300x200/4ECDC4/white?text=BaiTap' }}
                  style={styles.workoutImage}
                />
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{workout.tenbaitap || 'Không có tên'}</Text>
                  <View style={styles.workoutDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={16} color="gray" />
                      <Text style={styles.detailText}>{workout.thoigian || 'Không rõ thời gian'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="flame-outline" size={16} color="gray" />
                      <Text style={styles.detailText}>{workout.calories || 0} calo</Text>
                    </View>
                  </View>
                  <Button
                    mode="outlined"
                    style={styles.workoutButton}
                  >
                    Xem Chi Tiết
                  </Button>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
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
  workoutCard: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2 },
  workoutImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  workoutInfo: { flex: 1 },
  workoutName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  workoutDetails: { flexDirection: 'row', marginBottom: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  detailText: { marginLeft: 4, color: 'gray' },
  workoutButton: { marginTop: 4 },
  addButton: { borderRadius: 8 },
});
