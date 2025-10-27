import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Button, Avatar } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../components/ui/Navbar';
import { Colors } from '../constants/Colors';

export default function ProfileScreen({ isDarkMode, setDarkMode, setCurrentScreen, userRole = 'khachhang', userData, branchData }) {
  // Xác định role của user
  const isBusiness = userData?.loai_tai_khoan === 'business';
  const isPersonal = userData?.loai_tai_khoan === 'personal' && (!userData?.additional_info?.vai_tro || userData?.additional_info?.vai_tro === 'canhan');
  const isKhachHang = userData?.loai_tai_khoan === 'personal' && userData?.additional_info?.vai_tro === 'khachhang';
  const isNhanVien = userData?.loai_tai_khoan === 'personal' && userData?.additional_info?.vai_tro === 'nhanvien';

  // Hiển thị tên user
  const displayName = userData?.ten || userData?.ho_ten || userData?.name || "User";
  
  // Hiển thị vai trò
  const getSubtitle = () => {
    if (isBusiness) return "Công ty/Tập đoàn";
    if (isPersonal) return "Tài khoản cá nhân";
    if (isKhachHang) {
      const companyName = branchData?.ten_chi_nhanh || userData?.company_name || "công ty";
      return `Khách hàng công ty`;
    }
    if (isNhanVien) {
      const companyName = branchData?.ten_chi_nhanh || userData?.company_name || "công ty";
      return `Nhân viên công ty`;
    }
    return "Tài khoản cá nhân";
  };

  const userProfile = {
    name: displayName,
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPGV4dCB4PSI0MCIgeT0iNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjdCODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2cHgiPvCfkak8L3RleHQ+Cjwvc3ZnPgo=",
  };

  // Dynamic menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { icon: "person", label: "Thông Tin Cá Nhân", color: "#4ECDC4", action: () => setCurrentScreen('editProfile') },
    ];

    // Business, Personal và NhanVien thì bỏ "Huấn Luyện Viên"
    // Only show "Huấn Luyện Viên" for khachhang (customers under branch)
    if (userRole === 'khachhang') {
      baseItems.push(
        { icon: "people", label: "Huấn Luyện Viên", color: "#9B59B6", action: () => setCurrentScreen('trainer') }
      );
    }

    // Common items for all roles
    baseItems.push(
      { icon: "mail", label: "Liên hệ", color: "#F39C12", action: () => setCurrentScreen('contact') }
    );

    return baseItems;
  };

  const menuItems = getMenuItems();

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
            <Text style={styles.profileSubtitle}>{getSubtitle()}</Text>
            
            <View style={styles.profileButtons}>
              <Button
                mode="outlined"
                style={styles.editButton}
                onPress={() => setCurrentScreen('editProfile')}
                icon="create-outline"
              >
                Chỉnh Sửa
              </Button>
              <Button 
                mode="contained" 
                style={styles.shareButton}
                icon="share-outline"
              >
                Chia Sẻ
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