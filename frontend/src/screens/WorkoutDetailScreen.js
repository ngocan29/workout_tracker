import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();
  const [workoutTimer, setWorkoutTimer] = useState(1800);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Mock data cho các bài tập khác nhau
  const workoutDetails = {
    1: {
      name: 'Cardio Buổi Sáng',
      image: 'https://via.placeholder.com/300x200/FF6B6B/white?text=Cardio',
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
    },
    2: {
      name: 'Tập Tạ Cơ Bản',
      image: 'https://via.placeholder.com/300x200/4ECDC4/white?text=Weight',
      description: 'Bài tập tạ cơ bản giúp xây dựng sức mạnh cơ bắp và định hình cơ thể.',
      steps: [
        'Khởi động 10 phút với các động tác stretch',
        'Squat: 3 sets x 12 reps',
        'Push-up: 3 sets x 10 reps',
        'Deadlift: 3 sets x 8 reps',
        'Plank: 3 sets x 30 giây',
      ],
      benefits: [
        'Tăng khối lượng cơ bắp',
        'Cải thiện sức mạnh tổng thể',
        'Đốt cháy 300-400 calories',
        'Tăng cường mật độ xương',
      ],
    },
    3: {
      name: 'Yoga Thư Giãn',
      image: 'https://via.placeholder.com/300x200/9B59B6/white?text=Yoga',
      description: 'Yoga giúp thư giãn tinh thần, tăng tính linh hoạt và cân bằng cơ thể.',
      steps: [
        'Tư thế núi (Mountain Pose) - 2 phút',
        'Tư thế chó úp mặt (Downward Dog) - 3 phút',
        'Tư thế chiến binh (Warrior Pose) - 5 phút mỗi bên',
        'Tư thế em bé (Child Pose) - 3 phút',
        'Thiền thư giãn - 10 phút',
      ],
      benefits: [
        'Giảm stress và lo âu',
        'Tăng tính linh hoạt',
        'Cải thiện chất lượng giấc ngủ',
        'Tăng cường sự tập trung',
      ],
    },
  };

  const workout = workoutDetails[workoutId] || workoutDetails[1];

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft stroke={Colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
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
        {workout.steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Lợi Ích</Text>
        {workout.benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Text style={styles.benefitText}>✓ {benefit}</Text>
          </View>
        ))}
        
        {/* Padding bottom để tránh nút Complete che nội dung */}
        <View style={{ height: 80 }} />
      </ScrollView>
      
      {/* Fixed Complete Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.completeButton} onPress={() => router.back()}>
          <Text style={styles.completeButtonText}>Hoàn Thành</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
    lineHeight: 20,
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
    width: '100%',
    gap: 8,
  },
  timerButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  timerButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
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
    lineHeight: 20,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
  },
});