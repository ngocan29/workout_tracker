import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../app-example/components/ui/Navbar';
import { Colors } from '../app-example/constants/Colors';

export default function WorkoutScreen({ isDarkMode, setDarkMode, navigation }) {
  const workoutData = [
    {
      id: 1,
      name: "Cardio Buổi Sáng",
      duration: "30 phút",
      calories: 250,
      completed: true,
      image: "https://via.placeholder.com/300x200/FF6B6B/white?text=Cardio",
    },
    // ... other workouts
  ];

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

        {/* Today's Workouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Bài Tập Hôm Nay
            </Title>
            <Button mode="contained" style={styles.addButton}>
              Thêm Mới
            </Button>
          </View>
          {workoutData.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => navigation.navigate('WorkoutDetail')}
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