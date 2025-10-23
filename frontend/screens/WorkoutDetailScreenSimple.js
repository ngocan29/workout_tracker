import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../app-example/constants/Colors';

export default function WorkoutDetailScreen({ route, navigation, setCurrentScreen }) {
  // Lấy dữ liệu workout từ navigation params
  const workout = route?.params?.workout || {
    name: 'Bài Tập Mặc Định',
    description: 'Mô tả bài tập mặc định.',
    duration: '30 phút',
    calories: 200,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation ? navigation.goBack() : setCurrentScreen && setCurrentScreen('workout')}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>{workout.description}</Text>
        <Text style={styles.info}>Thời gian: {workout.duration}</Text>
        <Text style={styles.info}>Calories: {workout.calories}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation ? navigation.goBack() : setCurrentScreen && setCurrentScreen('workout')}
      >
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
  },
});