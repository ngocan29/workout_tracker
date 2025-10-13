// src/tabs/HomeTab.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { workoutData, achievementData } from '../../constants/Data';
import Colors from '../../constants/Colors';
import WorkoutModal from '../../components/ui/WorkoutModal';

export default function HomeTab({ setCurrentScreen, userProfile }) {
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={styles.title}>Chào {userProfile.name.split(' ')[2]}! 👋</Text>
      <FlatList
        data={workoutData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setCurrentScreen('workoutDetail')}>
            <Image source={{ uri: item.image }} style={styles.workoutImage} />
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{item.name}</Text>
              <Text style={styles.workoutDetails}>{item.duration} • {item.calories} calo</Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.heroText}>Hôm nay là ngày thứ 12 liên tiếp bạn tập luyện</Text>
            </View>
            <TouchableOpacity style={styles.quickAction} onPress={() => setShowWorkoutModal(true)}>
              <Text style={styles.quickActionText}>Bắt Đầu Tập</Text>
            </TouchableOpacity>
          </>
        }
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  heroText: {
    color: Colors.white,
    fontSize: 16,
  },
  quickAction: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  quickActionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
});