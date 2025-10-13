import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { achievementData } from '../../constants/Data';
import Colors from '../../constants/Colors';

export default function ProgressTab({ userProfile }) {
  const measurements = [
    { label: 'Vòng Eo', current: '78cm', change: '-3cm', color: Colors.success },
    { label: 'Vòng Ngực', current: '95cm', change: '+2cm', color: Colors.primary },
    { label: 'Vòng Đùi', current: '58cm', change: '-1cm', color: Colors.success },
    { label: 'Vòng Tay', current: '32cm', change: '+1cm', color: Colors.primary },
  ];

  const goals = [
    { goal: `Giảm xuống ${userProfile.targetWeight}kg`, current: userProfile.currentWeight, target: userProfile.targetWeight, unit: 'kg', progress: 75, deadline: '30/12/2024' },
    { goal: 'Chạy 5km không nghỉ', current: 3.2, target: 5, unit: 'km', progress: 64, deadline: '15/01/2025' },
    { goal: 'Tập 5 ngày/tuần', current: 4, target: 5, unit: 'ngày', progress: 80, deadline: 'Hàng tuần' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.overviewCard}>
        <Text style={styles.sectionTitle}>Tổng Quan Tiến Độ</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewIcon}>📈</Text>
            <Text style={styles.overviewValue}>{userProfile.currentWeight}kg</Text>
            <Text style={styles.overviewLabel}>Cân Nặng Hiện Tại</Text>
            <Text style={[styles.overviewChange, { color: Colors.success }]}>-2.3kg từ tháng trước</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewIcon}>💪</Text>
            <Text style={styles.overviewValue}>45.2kg</Text>
            <Text style={styles.overviewLabel}>Khối Lượng Cơ</Text>
            <Text style={[styles.overviewChange, { color: Colors.primary }]}>+1.1kg từ tháng trước</Text>
          </View>
        </View>
      </View>
      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Biểu Đồ Cân Nặng 30 Ngày</Text>
        <Image
          source={{ uri: 'https://...' }}
          style={styles.chartImage}
        />
      </View>
      <Text style={styles.sectionTitle}>Số Đo Cơ Thể</Text>
      <FlatList
        data={measurements}
        keyExtractor={item => item.label}
        renderItem={({ item }) => (
          <View style={styles.measurementItem}>
            <Text style={styles.measurementLabel}>{item.label}</Text>
            <View style={styles.measurementInfo}>
              <Text style={styles.measurementValue}>{item.current}</Text>
              <Text style={[styles.measurementChange, { backgroundColor: item.color }]}>{item.change}</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Thành Tích & Huy Hiệu</Text>
      <FlatList
        data={achievementData}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>{item.icon}</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{item.title}</Text>
              <Text style={styles.achievementDescription}>{item.description}</Text>
            </View>
            <Text style={[styles.achievementProgress, { color: item.color }]}>{item.progress}%</Text>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Tiến Độ Mục Tiêu</Text>
      <FlatList
        data={goals}
        keyExtractor={item => item.goal}
        renderItem={({ item }) => (
          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>{item.goal}</Text>
            <Text style={styles.goalDeadline}>{item.deadline}</Text>
            <Text style={styles.goalProgress}>{item.current} / {item.target} {item.unit} ({item.progress}%)</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
  },
  overviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  overviewLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  overviewChange: {
    fontSize: 12,
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  measurementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
  },
  measurementLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  measurementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 8,
  },
  measurementChange: {
    padding: 4,
    borderRadius: 8,
    color: Colors.white,
    fontSize: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  achievementProgress: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  goalDeadline: {
    fontSize: 14,
    color: Colors.textLight,
  },
  goalProgress: {
    fontSize: 14,
    color: Colors.primary,
  },
});