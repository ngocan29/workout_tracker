import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Title, Button, Avatar } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../app-example/components/ui/Navbar';
import { Colors } from '../app-example/constants/Colors';

export default function ProfileScreen({ isDarkMode, setDarkMode, setCurrentScreen }) {
  const userProfile = {
    name: "Nguyễn Minh Tuấn",
    avatar: "https://via.placeholder.com/80",
    workouts: 156,
    achievements: 23,
    trainingHours: "42h",
  };

  const menuItems = [
    { icon: "person", label: "Thông Tin Cá Nhân", color: "#4ECDC4", action: () => setCurrentScreen('editProfile') },
    { icon: "target", label: "Mục Tiêu & Kế Hoạch", color: "#FF6B6B" },
    { icon: "trophy", label: "Thành Tích & Huy Hiệu", color: "#F39C12" },
    { icon: "people", label: "Huấn Luyện Viên", color: "#9B59B6", action: () => setCurrentScreen('trainer') },
    { icon: "star", label: "Gói Premium", color: "#E74C3C" },
  ];

  const handleLogout = () => {
    // TODO: replace with real logout logic (clear tokens, navigate, etc.)
    setCurrentScreen('login');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Image size={80} source={{ uri: userProfile.avatar }} style={styles.avatar} />
            <Title style={styles.profileName}>{userProfile.name}</Title>
            <Text style={styles.profileSubtitle}>Fitness Enthusiast • Premium Member</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#3b82f6' }]}>{userProfile.workouts}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#10b981' }]}>{userProfile.achievements}</Text>
                <Text style={styles.statLabel}>Achievements</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#f59e0b' }]}>{userProfile.trainingHours}</Text>
                <Text style={styles.statLabel}>Training</Text>
              </View>
            </View>
            <View style={styles.profileButtons}>
              <Button
                mode="outlined"
                style={styles.editButton}
                onPress={() => setCurrentScreen('editProfile')}
              >
                <Ionicons name="create-outline" size={16} /> Chỉnh Sửa
              </Button>
              <Button mode="contained" style={styles.shareButton}>
                <Ionicons name="share-outline" size={16} /> Chia Sẻ
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Menu Options */}
        <View style={styles.section}>
          <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
            Cài Đặt & Tính Năng
          </Title>
          <Card style={styles.menuCard}>
            <Card.Content>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={item.action}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="gray" />
                </TouchableOpacity>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Version / Legal / Support Card (converted from web) */}
        <View style={{ margin: 16 }}>
          <Card style={{ borderRadius: 12 }}>
            <Card.Content style={{ alignItems: 'center' }}>
              <Text style={{ color: '#6b7280', fontSize: 14, marginBottom: 8 }}>FitTracker Pro v2.1.0</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => setCurrentScreen('terms')}
                  style={{ borderRadius: 20, marginHorizontal: 6 }}
                  labelStyle={{ fontSize: 13 }}
                >
                  Điều Khoản
                </Button>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => setCurrentScreen('privacy')}
                  style={{ borderRadius: 20, marginHorizontal: 6 }}
                  labelStyle={{ fontSize: 13 }}
                >
                  Bảo Mật
                </Button>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => setCurrentScreen('support')}
                  style={{ borderRadius: 20, marginHorizontal: 6 }}
                  labelStyle={{ fontSize: 13 }}
                >
                  Hỗ Trợ
                </Button>
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: '#e5e7eb', alignSelf: 'stretch', marginVertical: 8 }} />

              <Button
                mode="outlined"
                onPress={handleLogout}
                style={{ alignSelf: 'stretch', marginTop: 6, borderRadius: 8, borderColor: '#fca5a5' }}
                labelStyle={{ color: '#ef4444' }}
              >
                Đăng Xuất
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  profileCard: { margin: 16, borderRadius: 12 },
  profileContent: { alignItems: 'center' },
  avatar: { backgroundColor: '#e5e7eb', marginBottom: 12 },
  profileName: { fontSize: 24, marginBottom: 4 },
  profileSubtitle: { color: 'gray', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 16 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: 'gray' },
  profileButtons: { flexDirection: 'row', gap: 8 },
  editButton: { flex: 1 },
  shareButton: { flex: 1 },
  section: { marginHorizontal: 16 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  menuCard: { borderRadius: 12 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16 },
  logoutCard: { margin: 16, borderRadius: 12 },
  logoutButton: { padding: 16, alignItems: 'center' },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
});