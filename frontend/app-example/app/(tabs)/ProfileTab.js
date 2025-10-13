import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export default function ProfileTab({ setCurrentScreen, userProfile }) {
  const activities = [
    { activity: 'Hoàn thành bài tập Cardio 30 phút', time: '2 giờ trước', icon: '🏃‍♂️' },
    { activity: 'Đạt mục tiêu 10,000 bước chân', time: '5 giờ trước', icon: '👟' },
    { activity: 'Ghi nhận bữa trưa - 520 calo', time: '1 ngày trước', icon: '🥗' },
    { activity: 'Nhận huy hiệu "7 ngày liên tiếp"', time: '2 ngày trước', icon: '🏆' },
  ];

  const menuItems = [
    { label: 'Thông Tin Cá Nhân', color: Colors.primary, action: () => setCurrentScreen('editProfile') },
    { label: 'Huấn Luyện Viên', color: Colors.secondary, action: () => setCurrentScreen('trainer') },
    { label: 'Gói Premium', color: Colors.error, link: 'https://...' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.profileCard}>
        <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.subtitle}>Fitness Enthusiast • Premium Member</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>156</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.success }]}>23</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.warning }]}>42h</Text>
            <Text style={styles.statLabel}>Training</Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={() => setCurrentScreen('editProfile')}>
            <Text style={styles.editButtonText}>Chỉnh Sửa Hồ Sơ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Chia Sẻ</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Cài Đặt & Tính Năng</Text>
      <FlatList
        data={menuItems}
        keyExtractor={item => item.label}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={item.action}>
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
              <Text style={{ color: item.color }}>★</Text>
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.sectionTitle}>Hoạt Động Gần Đây</Text>
      <FlatList
        data={activities}
        keyExtractor={item => item.activity}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>{item.icon}</Text>
            <View>
              <Text style={styles.activityText}>{item.activity}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>FitTracker Pro v2.1.0</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => setCurrentScreen('login')}>
          <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  shareButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    color: Colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityText: {
    fontSize: 16,
    color: Colors.text,
  },
  activityTime: {
    fontSize: 14,
    color: Colors.textLight,
  },
  appInfo: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 14,
    color: Colors.error,
  },
});