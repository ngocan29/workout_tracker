import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/Colors';
import { WorkoutService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();
  const [workoutTimer, setWorkoutTimer] = useState(0); // Sẽ được set từ thoigiangoc
  const [initialTimer, setInitialTimer] = useState(0); // Lưu thời gian gốc
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0); // Tổng thời gian đã tập

useEffect(() => {
  const fetchWorkoutDetail = async () => {
    console.log("workoutId:", workoutId)
    try {
      const res = await WorkoutService.getWorkoutDetail(workoutId);
      console.log("✅ Dữ liệu bài tập:", res);

      // Kiểm tra phản hồi từ API
      if (res && (res.data || res)._id) {
        const data = res.data || res;
        setWorkout(data);
        
        // Set thời gian từ thoigiangoc (chuyển từ phút sang giây)
        const timeInSeconds = (data.thoigiangoc || 30) * 60;
        setWorkoutTimer(timeInSeconds);
        setInitialTimer(timeInSeconds);
        setTotalWorkoutTime(data.sophuttap || 0);
      } else {
        console.warn("⚠️ Không tìm thấy bài tập hoặc dữ liệu rỗng.");
        setWorkout(null);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải chi tiết bài tập:", error);
      setWorkout(null);
    } finally {
      setLoading(false);
    }
  };

  if (workoutId) fetchWorkoutDetail();
}, [workoutId]);

// Timer effect
useEffect(() => {
  let timer;
  if (isTimerRunning) {
    timer = setInterval(() => {
      setWorkoutTimer(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          handleWorkoutComplete();
          return 0;
        }
        return prev - 1;
      });
      
      // Cập nhật tổng thời gian đã tập (mỗi giây)
      setTotalWorkoutTime(prev => prev + 1/60); // Chuyển sang phút
    }, 1000);
  }

  return () => clearInterval(timer);
}, [isTimerRunning]);

// Save workout progress khi component unmount hoặc pause
const saveWorkoutProgress = async () => {
  if (!workout) return;
  
  try {
    const timeWorkedInMinutes = Math.floor(totalWorkoutTime);
    
    await WorkoutService.updateWorkout(workout._id, {
      sophuttap: timeWorkedInMinutes,
      thongke: workout.thongke + 1, // Tăng thống kê
      ngaycapnhat: new Date()
    });
    
    console.log('✅ Đã lưu tiến độ tập luyện:', timeWorkedInMinutes, 'phút');
  } catch (error) {
    console.error('❌ Lỗi khi lưu tiến độ:', error);
  }
};

// Handle workout completion
const handleWorkoutComplete = async () => {
  if (!workout) return;
  
  try {
    await WorkoutService.updateWorkout(workout._id, {
      trangthai: 'hoanthanh',
      sophuttap: Math.floor(totalWorkoutTime),
      thongke: workout.thongke + 1,
      ngaycapnhat: new Date()
    });
    
    console.log('✅ Bài tập đã hoàn thành');
    router.back();
  } catch (error) {
    console.error('❌ Lỗi khi hoàn thành bài tập:', error);
  }
};

// Handle pause/back navigation
const handlePauseOrExit = async () => {
  if (isTimerRunning || totalWorkoutTime > 0) {
    setIsTimerRunning(false);
    await saveWorkoutProgress();
  }
  router.back();
};

// Start/pause timer
const toggleTimer = () => {
  if (!isTimerRunning) {
    setWorkoutStartTime(new Date());
  }
  setIsTimerRunning(!isTimerRunning);
};

// Reset timer
const resetTimer = () => {
  setIsTimerRunning(false);
  setWorkoutTimer(initialTimer);
  setTotalWorkoutTime(0);
};

  //tránh crash khi workout chưa load
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }
  
  if (!workout) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Bài tập không tồn tại hoặc đã bị xóa.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePauseOrExit}>
          <ArrowLeft stroke={Colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.ten}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.imageCard}>
          <Image source={{ uri: workout.anhminhhoa || 'https://via.placeholder.com/150' }} style={styles.workoutImage} />
          <Text style={styles.description}>{workout.mota}</Text>
        </View>
        
        <View style={styles.timerCard}>
          <Text style={styles.timerText}>
            {Math.floor(workoutTimer / 60)}:{String(workoutTimer % 60).padStart(2, '0')}
          </Text>
          
          {/* Hiển thị thời gian đã tập */}
          <Text style={styles.progressText}>
            Đã tập: {Math.floor(totalWorkoutTime)} phút
          </Text>
          
          <View style={styles.timerButtons}>
            <TouchableOpacity
              style={[styles.timerButton, isTimerRunning && { backgroundColor: Colors.gray }]}
              onPress={toggleTimer}
            >
              <Text style={styles.timerButtonText}>{isTimerRunning ? 'Tạm Dừng' : 'Bắt Đầu'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timerButton}
              onPress={resetTimer}
            >
              <Text style={styles.timerButtonText}>Làm Lại</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Các Bước Thực Hiện</Text>
        {Array.isArray(workout.cacbuoc) && workout.cacbuoc.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>Lợi Ích</Text>
        {Array.isArray(workout.loiich) && workout.loiich.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Text style={styles.benefitText}>✓ {benefit}</Text>
          </View>
        ))}

        
        {/* Padding bottom để tránh nút Complete che nội dung */}
        <View style={{ height: 80 }} />
      </ScrollView>
      
      {/* Fixed Complete Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.completeButton} onPress={handleWorkoutComplete}>
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
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 12,
    fontWeight: '600',
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