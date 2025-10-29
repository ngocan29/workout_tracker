import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform, Modal } from 'react-native';
import { Card, Title, Button, Avatar } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Navbar from '../components/ui/Navbar';
import { Colors } from '../constants/Colors';

export default function ProfileScreen({ isDarkMode, setDarkMode, setCurrentScreen, userRole = 'khachhang', userData, branchData }) {
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
      return `Khách hàng công ty`;
    }
    if (isNhanVien) {
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

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');
      if (confirmLogout) {
        await performLogout();
      }
    } else {
      Alert.alert(
        'Xác nhận đăng xuất',
        'Bạn có chắc chắn muốn đăng xuất không?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Đăng xuất',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    }
  };

  const performLogout = async () => {
    try {
      // Clear stored user data
      await AsyncStorage.multiRemove(['userData', 'accessToken', 'userId']);
      
      // Navigate to login screen
      if (setCurrentScreen) {
        setCurrentScreen('login');
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleShowTerms = () => {
    setShowTermsModal(true);
  };

  const handleShowPrivacy = () => {
    setShowPrivacyModal(true);
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
                  onPress={handleShowTerms}
                  style={{ borderRadius: 20, marginHorizontal: 6 }}
                  labelStyle={{ fontSize: 13 }}
                >
                  Điều Khoản
                </Button>
                <Button
                  mode="outlined"
                  compact
                  onPress={handleShowPrivacy}
                  style={{ borderRadius: 20, marginHorizontal: 6 }}
                  labelStyle={{ fontSize: 13 }}
                >
                  Bảo Mật
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

      {/* Terms Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb' }]}>
          <View style={[styles.modalHeader, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <TouchableOpacity onPress={() => setShowTermsModal(false)}>
              <Ionicons name="close" size={24} color={isDarkMode ? Colors.darkText : Colors.black} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Điều Khoản Sử Dụng
            </Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={[styles.modalText, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              <Text style={styles.modalSectionTitle}>1. Chấp nhận các điều khoản{'\n'}</Text>
              Bằng cách sử dụng ứng dụng FitTracker Pro, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng này.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>2. Mô tả dịch vụ{'\n'}</Text>
              FitTracker Pro là một ứng dụng theo dõi sức khỏe và thể dục, cung cấp các tính năng như theo dõi bài tập, dinh dưỡng, và quản lý mục tiêu cá nhân.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>3. Quyền riêng tư và dữ liệu{'\n'}</Text>
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Tất cả dữ liệu sẽ được xử lý theo chính sách bảo mật của chúng tôi.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>4. Trách nhiệm người dùng{'\n'}</Text>
              Bạn có trách nhiệm duy trì tính bảo mật của tài khoản và chịu trách nhiệm về tất cả các hoạt động diễn ra dưới tài khoản của bạn.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>5. Hạn chế trách nhiệm{'\n'}</Text>
              FitTracker Pro không chịu trách nhiệm về bất kỳ tổn thất hoặc thiệt hại nào phát sinh từ việc sử dụng ứng dụng.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>6. Thay đổi điều khoản{'\n'}</Text>
              Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>7. Liên hệ{'\n'}</Text>
              Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email: thientuyet1192005@gmail.com
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb' }]}>
          <View style={[styles.modalHeader, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
              <Ionicons name="close" size={24} color={isDarkMode ? Colors.darkText : Colors.black} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Chính Sách Bảo Mật
            </Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={[styles.modalText, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              <Text style={styles.modalSectionTitle}>1. Thu thập thông tin{'\n'}</Text>
              Chúng tôi thu thập thông tin cá nhân như tên, email, thông tin sức khỏe để cung cấp dịch vụ tốt nhất cho bạn.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>2. Sử dụng thông tin{'\n'}</Text>
              Thông tin của bạn được sử dụng để:{'\n'}
              • Cung cấp và cải thiện dịch vụ{'\n'}
              • Gửi thông báo quan trọng{'\n'}
              • Phân tích và tối ưu hóa ứng dụng{'\n'}
              • Hỗ trợ khách hàng{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>3. Chia sẻ thông tin{'\n'}</Text>
              Chúng tôi không bán, trao đổi, hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>4. Bảo mật dữ liệu{'\n'}</Text>
              Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn khỏi truy cập, thay đổi, tiết lộ hoặc phá hủy trái phép.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>5. Quyền của người dùng nếu được cấp{'\n'}</Text>
              Bạn có quyền:{'\n'}
              • Truy cập và cập nhật thông tin cá nhân{'\n'}
              • Yêu cầu xóa dữ liệu{'\n'}
              • Từ chối thu thập dữ liệu{'\n'}
              • Khiếu nại về việc xử lý dữ liệu{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>6. Thay đổi chính sách{'\n'}</Text>
              Chính sách bảo mật này có thể được cập nhật định kỳ. Chúng tôi sẽ thông báo về các thay đổi quan trọng.{'\n\n'}
              
              <Text style={styles.modalSectionTitle}>7. Liên hệ{'\n'}</Text>
              Nếu bạn có câu hỏi về chính sách bảo mật, liên hệ: thientuyet1192005@gmail.com
            </Text>
          </ScrollView>
        </View>
      </Modal>
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
  
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
  },
  modalSectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});