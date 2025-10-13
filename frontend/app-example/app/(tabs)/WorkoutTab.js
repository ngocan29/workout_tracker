import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { Search } from 'react-native-feather';
import { workoutData } from '../../constants/Data';
import Colors from '../../constants/Colors';
import WorkoutModal from '../../components/ui/WorkoutModal';

export default function WorkoutTab({ setCurrentScreen }) {
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  const categories = [
    { name: 'Cardio', icon: 'https://...', color: Colors.primary },
    { name: 'Tạ', icon: 'https://...', color: Colors.secondary },
    { name: 'Yoga', icon: 'https://...', color: '#A78BFA' },
    { name: 'HIIT', icon: 'https://...', color: '#F472B6' },
    { name: 'Pilates', icon: 'https://...', color: '#D8B4FE' },
    { name: 'Khác', icon: 'https://...', color: Colors.gray },
  ];

  const recommendedPrograms = [
    { name: 'Giảm Cân Nhanh - 7 Ngày', difficulty: 'Trung Bình', duration: '30 phút/ngày', rating: 4.8, image: 'https://...' },
    { name: 'Xây Dựng Cơ Bắp', difficulty: 'Khó', duration: '45 phút/ngày', rating: 4.9, image: 'https://...' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bài tập..."
          placeholderTextColor={Colors.textLight}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Search stroke={Colors.primary} width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryCard}>
            <Image source={{ uri: category.icon }} style={styles.categoryIcon} />
            <Text style={[styles.categoryText, { color: category.color }]}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Bài Tập Hôm Nay</Text>
      <FlatList
        data={workoutData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.workoutCard}
            onPress={() => {
              setCurrentScreen('workoutDetail');
            }}
          >
            <Image source={{ uri: item.image }} style={styles.workoutImage} />
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{item.name}</Text>
              <Text style={styles.workoutDetails}>{item.duration} • {item.calories} calo</Text>
            </View>
            <TouchableOpacity style={[styles.workoutButton, item.completed && styles.completedButton]}>
              <Text style={styles.workoutButtonText}>{item.completed ? 'Hoàn Thành' : 'Bắt Đầu'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <>
            <Text style={styles.sectionTitle}>Gợi Ý Cho Bạn</Text>
            <FlatList
              data={recommendedPrograms}
              keyExtractor={item => item.name}
              renderItem={({ item }) => (
                <View style={styles.programCard}>
                  <Image source={{ uri: item.image }} style={styles.programImage} />
                  <Text style={styles.programTitle}>{item.name}</Text>
                  <View style={styles.programInfo}>
                    <Text style={styles.programTag}>{item.difficulty}</Text>
                    <Text style={styles.programRating}>{item.rating} ★</Text>
                  </View>
                  <Text style={styles.programDetails}>{item.duration}</Text>
                  <TouchableOpacity style={styles.programButton}>
                    <Text style={styles.programButtonText}>Tham Gia Chương Trình</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setShowWorkoutModal(true)}>
        <Text style={styles.addButtonText}>Thêm Mới</Text>
      </TouchableOpacity>
      <WorkoutModal visible={showWorkoutModal} onClose={() => setShowWorkoutModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  workoutCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  workoutImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  workoutDetails: {
    fontSize: 14,
    color: Colors.textLight,
  },
  workoutButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 8,
  },
  completedButton: {
    backgroundColor: Colors.gray,
  },
  workoutButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  programCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  programImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  programInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  programTag: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    padding: 4,
    borderRadius: 8,
  },
  programRating: {
    color: Colors.warning,
  },
  programDetails: {
    fontSize: 14,
    color: Colors.textLight,
  },
  programButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  programButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});