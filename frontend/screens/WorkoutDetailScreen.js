import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import Colors from '../app-example/constants/Colors';

export default function WorkoutDetailScreen({ setCurrentScreen }) {
  const [workoutTimer, setWorkoutTimer] = useState(1800);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const workout = {
    name: 'Cardio Buổi Sáng',
    image: 'https://...',
    description: 'Tập cardio buổi sáng giúp tăng cường trao đổi chất, đốt cháy mỡ thừa và cải thiện sức bền tim mạch.',
    steps: [
      'Khởi động 5 phút với các động tác stretching nhẹ nhàng',
      'Chạy tại chỗ với cường độ vừa phải trong 10 phút',
      'Thực hiện 50 lần nhảy dây, nghỉ 30 giây',
      'Thực hiện 10 burpees, nghỉ 30 giây',
      'Lặp lại 3 vòng',
    ],
    benefits: [
      'Đốt cháy 250-300 calories',
      'Tăng cường sức bền tim mạch',
      'Cải thiện trao đổi chất',
      'Giảm mỡ toàn thân',
    ],
  };

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setWorkoutTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('main')}>
          <ArrowLeft stroke={Colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.imageCard}>
        <Image source={{ uri: workout.image }} style={styles.workoutImage} />
        <Text style={styles.description}>{workout.description}</Text>
      </View>
      <View style={styles.timerCard}>
        <Text style={styles.timerText}>
          {Math.floor(workoutTimer / 60)}:{String(workoutTimer % 60).padStart(2, '0')}
        </Text>
        <View style={styles.timerButtons}>
          <TouchableOpacity
            style={[styles.timerButton, isTimerRunning && { backgroundColor: Colors.gray }]}
            onPress={() => setIsTimerRunning(!isTimerRunning)}
          >
            <Text style={styles.timerButtonText}>{isTimerRunning ? 'Tạm Dừng' : 'Bắt Đầu'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={() => {
              setWorkoutTimer(1800);
              setIsTimerRunning(false);
            }}
          >
            <Text style={styles.timerButtonText}>Làm Lại</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Các Bước Thực Hiện</Text>
      <FlatList
        data={workout.steps}
        keyExtractor={item => item}
        renderItem={({ item, index }) => (
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{item}</Text>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Lợi Ích</Text>
      <FlatList
        data={workout.benefits}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.benefitItem}>
            <Text style={styles.benefitText}>✓ {item}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.completeButton} onPress={() => setCurrentScreen('main')}>
        <Text style={styles.completeButtonText}>Hoàn Thành</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  imageCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  workoutImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
  },
  timerCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timerButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  timerButtonText: {
    fontSize: 16,
    color: Colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    color: Colors.white,
  },
  stepText: {
    fontSize: 14,
    color: Colors.text,
  },
  benefitItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.text,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
  },
});