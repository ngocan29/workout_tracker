import React, { useState, useEffect, useCallback } from 'react'; // Nhập React, useState, useEffect, useCallback để quản lý trạng thái và fetch dữ liệu
import { View, Text, Button, FlatList, StyleSheet, Alert, RefreshControl, TextInput, Modal, TouchableOpacity } from 'react-native'; // Nhập các thành phần giao diện bao gồm Modal
import { useRouter, useFocusEffect } from 'expo-router'; // Nhập useRouter và useFocusEffect từ expo-router để điều hướng và focus
import { Colors } from '../constants/Colors'; // Nhập Colors để sử dụng màu sắc
import { AuthService, BranchService } from '../services/api'; // Nhập services từ API
import AsyncStorage from '@react-native-async-storage/async-storage'; // Nhập AsyncStorage để lưu trữ dark mode

export default function MainScreen() {
  const [userData, setUserData] = useState(null); // Trạng thái cho dữ liệu người dùng
  const [branches, setBranches] = useState([]); // Trạng thái cho danh sách chi nhánh
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới danh sách
  const [showAddModal, setShowAddModal] = useState(false); // Trạng thái hiển thị modal thêm chi nhánh
  const [showEditModal, setShowEditModal] = useState(false); // Trạng thái hiển thị modal sửa chi nhánh
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Trạng thái hiển thị modal xác nhận đăng xuất
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Trạng thái hiển thị modal xác nhận xóa chi nhánh
  const [editingBranch, setEditingBranch] = useState(null); // Chi nhánh đang được sửa
  const [deletingBranch, setDeletingBranch] = useState(null); // Chi nhánh đang được xóa
  const [branchName, setBranchName] = useState(''); // Tên chi nhánh trong modal
  const [branchAddress, setBranchAddress] = useState(''); // Địa chỉ chi nhánh trong modal
  const [isDarkMode, setIsDarkMode] = useState(false); // State quản lý dark mode
  const router = useRouter(); // Hook điều hướng

  useEffect(() => { // Hook để tải dữ liệu khi màn hình khởi tạo
    loadData(); // Gọi hàm tải dữ liệu (Trang_chủ_chung)
    loadDarkModeState(); // Load dark mode state
  }, []); // Chỉ chạy một lần khi mount

  useFocusEffect( // Hook để tải lại dữ liệu khi màn hình được focus
    useCallback(() => {
      loadData(); // Tải lại dữ liệu mỗi khi quay lại màn hình (để cập nhật hồ sơ mới)
    }, [])
  );

  // Load dark mode state từ AsyncStorage
  const loadDarkModeState = async () => {
    try {
      const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
    } catch (error) {
      console.log('Error loading dark mode:', error);
    }
  };

  // Toggle dark mode và save state
  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newValue));
    } catch (error) {
      console.log('Error saving dark mode:', error);
    }
  };

  const loadData = async () => { // Hàm tải dữ liệu người dùng và chi nhánh
    try {
      setLoading(true); // Bắt đầu trạng thái tải
      
      // Lấy thông tin user từ API
      const userProfile = await AuthService.getProfile();
      setUserData(userProfile);
      
      // Lấy danh sách chi nhánh của user hiện tại
      if (userProfile.loai_tai_khoan === 'business') {
        const branchData = await BranchService.getMyBranches();
        setBranches(branchData || []);
      }
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setLoading(false); // Kết thúc trạng thái tải
    }
  };

  const handleRefresh = async () => { // Hàm làm mới danh sách chi nhánh
    setRefreshing(true); // Bắt đầu làm mới
    await loadData(); // Tải lại dữ liệu
    setRefreshing(false); // Kết thúc làm mới
  };

  const handleLogout = () => { // Hàm hiển thị modal xác nhận đăng xuất
    setShowLogoutModal(true); // Hiển thị modal xác nhận đăng xuất
  };

  const confirmLogout = async () => { // Hàm thực hiện đăng xuất sau khi xác nhận
    try {
      await AuthService.logout(); // Gọi API đăng xuất thật
      router.replace('/'); // Chuyển về Đăng_nhập (Chưa_đăng_nhập)
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất');
    } finally {
      setShowLogoutModal(false); // Đóng modal dù thành công hay lỗi
    }
  };

  const handleEditProfile = () => { // Hàm mở màn hình chỉnh sửa hồ sơ (business only)
    router.push({ pathname: '/edit-profile', params: { userData: JSON.stringify(userData) } }); // Điều hướng đến EditProfileScreen
  };

  const handleBranchPress = (branch) => { // Hàm xử lý khi nhấn vào card chi nhánh
    // Lưu thông tin chi nhánh đã chọn vào AsyncStorage hoặc context
    router.push({ 
      pathname: '/branch-home', // Điều hướng đến màn hình BranchHome với bottom tabs
      params: { 
        branchData: JSON.stringify(branch), // Truyền thông tin chi nhánh
        userData: JSON.stringify(userData) // Truyền thông tin người dùng
      } 
    }); 
  };

  const handleAddBranch = () => { // Hàm mở modal thêm chi nhánh mới (business only)
    setBranchName(''); // Reset tên chi nhánh
    setBranchAddress(''); // Reset địa chỉ chi nhánh
    setShowAddModal(true); // Hiển thị modal thêm chi nhánh
  };

  const handleSaveBranch = async () => { // Hàm lưu chi nhánh mới từ modal
    if (!branchName.trim() || !branchAddress.trim()) { // Kiểm tra dữ liệu đầu vào
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên và địa chỉ chi nhánh');
      return;
    }

    try {
      const newBranch = await BranchService.createBranch({ // Gọi API tạo chi nhánh
        ten: branchName.trim(),
        diachi: branchAddress.trim()
      });
      setBranches([...branches, newBranch]); // Thêm chi nhánh mới vào danh sách
      setShowAddModal(false); // Đóng modal
      Alert.alert('Thành công', 'Thêm chi nhánh thành công!');
    } catch (error) {
      console.error('Add branch error:', error);
      Alert.alert('Lỗi', 'Không thể thêm chi nhánh');
    }
  };

  const handleEditBranch = (branch) => { // Hàm mở modal chỉnh sửa chi nhánh
    setEditingBranch(branch); // Lưu chi nhánh đang được sửa
    setBranchName(branch.ten); // Đặt tên chi nhánh hiện tại vào form
    setBranchAddress(branch.diachi); // Đặt địa chỉ chi nhánh hiện tại vào form
    setShowEditModal(true); // Hiển thị modal sửa chi nhánh
  };

  const handleUpdateBranch = async () => { // Hàm cập nhật chi nhánh từ modal sửa
    if (!branchName.trim() || !branchAddress.trim()) { // Kiểm tra dữ liệu đầu vào
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên và địa chỉ chi nhánh');
      return;
    }

    try {
      const updatedBranch = await BranchService.updateBranch(editingBranch._id, { // Gọi API PUT để cập nhật chi nhánh
        ten: branchName.trim(),
        diachi: branchAddress.trim()
      });
      setBranches(branches.map(b => b._id === editingBranch._id ? updatedBranch : b)); // Cập nhật danh sách chi nhánh
      setShowEditModal(false); // Đóng modal sửa
      setEditingBranch(null); // Reset chi nhánh đang sửa
      Alert.alert('Thành công', 'Cập nhật chi nhánh thành công!');
    } catch (error) {
      console.error('Update branch error:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật chi nhánh');
    }
  };

  const handleDeleteBranch = (branch) => { // Hàm hiển thị modal xác nhận xóa chi nhánh
    setDeletingBranch(branch); // Lưu chi nhánh cần xóa
    setShowDeleteModal(true); // Hiển thị modal xác nhận xóa
  };

  const confirmDeleteBranch = async () => { // Hàm thực hiện xóa chi nhánh sau khi xác nhận
    try {
      await BranchService.deleteBranch(deletingBranch._id); // Gọi DELETE API để xóa chi nhánh
      setBranches(branches.filter(b => b._id !== deletingBranch._id)); // Xóa khỏi danh sách local
      Alert.alert('Thành công', 'Xóa chi nhánh thành công!');
    } catch (error) {
      console.error('Delete branch error:', error);
      Alert.alert('Lỗi', 'Không thể xóa chi nhánh');
    } finally {
      setShowDeleteModal(false); // Đóng modal dù thành công hay lỗi
      setDeletingBranch(null); // Reset chi nhánh đang xóa
    }
  };

  if (loading) { // Nếu đang tải, hiển thị loading
    return (
      <View style={[styles.center, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white }]}> {/* Container căn giữa cho loading */}
        <Text style={[styles.loadingText, { color: isDarkMode ? Colors.darkText : Colors.black }]}>Đang tải...</Text> {/* Văn bản loading */}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white }]}> {/* Container chính */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? Colors.darkSurface : Colors.background }]}> {/* Header hiển thị thông tin người dùng */}
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerText, { color: isDarkMode ? Colors.darkText : Colors.black }]}>Xin chào, {userData?.ten}</Text> {/* Chào mừng người dùng */}
            <Text style={[styles.email, { color: isDarkMode ? Colors.darkSecondary : Colors.gray }]}>{userData?.email}</Text> {/* Hiển thị email */}
          </View>
          <TouchableOpacity 
            style={[styles.darkModeButton, { backgroundColor: isDarkMode ? Colors.darkGreen : Colors.lightGreen }]}
            onPress={toggleDarkMode}
          >
            <Text style={styles.darkModeIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
        </View>
        {userData?.loai_tai_khoan === 'business' && ( // Nếu là business, hiển thị nút chỉnh sửa hồ sơ
          <Button title="Chỉnh sửa hồ sơ" onPress={handleEditProfile} color={Colors.primary} /> // Nút mở EditProfileScreen
        )}
        <Button title="Đăng xuất" onPress={handleLogout} color={Colors.accent} /> {/* Nút đăng xuất */}
      </View> {/* Kết thúc header */}
      <FlatList // Danh sách chi nhánh
        data={branches} // Dữ liệu chi nhánh
        keyExtractor={(item) => item._id.toString()} // Key cho từng item (dùng _id từ MongoDB)
        renderItem={({ item }) => ( // Render mỗi chi nhánh
          <TouchableOpacity 
            style={[styles.branchItem, { 
              backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
              borderColor: isDarkMode ? Colors.darkBackground : '#e1e5e9'
            }]} // Card chi nhánh có thể nhấn
            onPress={() => handleBranchPress(item)} // Nhấn vào card chi nhánh để vào HomeScreen
            activeOpacity={0.8} // Hiệu ứng nhấn
          >
            <Text style={[styles.branchName, { color: isDarkMode ? Colors.darkText : Colors.black }]}>{item.ten}</Text> {/* Tên chi nhánh */}
            <Text style={[styles.branchAddress, { color: isDarkMode ? Colors.darkSecondary : Colors.gray }]}>{item.diachi}</Text> {/* Địa chỉ chi nhánh */}
            {userData?.loai_tai_khoan === 'business' ? ( // Nếu là business, hiển thị nút quản lý (Dashboard_business)
              <>
              <View style={{height: 4}}></View>
                <TouchableOpacity 
                  style={styles.actionButton} // Style cho nút hành động
                  onPress={(e) => { e.stopPropagation(); handleEditBranch(item); }} // Ngăn sự kiện truyền lên card
                >
                  <Text style={styles.actionButtonText}>Sửa</Text>
                </TouchableOpacity>
                <View style={{height: 4}}></View>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]} // Style cho nút xóa
                  onPress={(e) => { e.stopPropagation(); handleDeleteBranch(item); }} // Ngăn sự kiện truyền lên card
                >
                  <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
              </>
            ) : null} {/* Personal không có nút quản lý (Dashboard_personal) */}
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />} // Kéo để làm mới danh sách
      /> {/* Kết thúc FlatList */}
      {userData?.loai_tai_khoan === 'business' && ( // Nếu là business, hiển thị nút thêm chi nhánh
        <Button title="Thêm chi nhánh" onPress={handleAddBranch} color={Colors.primary} /> // Nút thêm chi nhánh
      )} {/* Kết thúc nút thêm */}

      {/* Modal thêm chi nhánh */}
      <Modal
        visible={showAddModal} // Hiển thị modal khi showAddModal = true
        animationType="slide" // Hiệu ứng trượt từ dưới lên
        transparent={true} // Modal trong suốt
      >
        <TouchableOpacity 
          style={styles.modalContainer} // Container modal có thể nhấn
          activeOpacity={1} // Không thay đổi độ trong suốt khi nhấn
          onPress={() => setShowAddModal(false)} // Đóng modal khi nhấn vào vùng ngoài
        >
          <TouchableOpacity 
            style={[styles.modalContent, { backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white }]} // Nội dung modal
            activeOpacity={1} // Không thay đổi độ trong suốt
            onPress={(e) => e.stopPropagation()} // Ngăn không cho sự kiện truyền lên parent
          >
            <Text style={[styles.modalTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>Thêm chi nhánh</Text> {/* Tiêu đề modal */}
            
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]} // Style input
              placeholder="Tên chi nhánh" // Placeholder cho tên
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={branchName} // Giá trị tên chi nhánh
              onChangeText={setBranchName} // Cập nhật tên chi nhánh
            />
            
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]} // Style input
              placeholder="Địa chỉ chi nhánh" // Placeholder cho địa chỉ
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={branchAddress} // Giá trị địa chỉ chi nhánh
              onChangeText={setBranchAddress} // Cập nhật địa chỉ chi nhánh
              multiline // Cho phép nhiều dòng
            />
            
            <View style={styles.modalActions}> {/* Container các nút hành động */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} // Style nút hủy
                onPress={() => setShowAddModal(false)} // Đóng modal khi nhấn hủy
              >
                <Text style={styles.cancelButtonText}>Hủy</Text> {/* Văn bản nút hủy */}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} // Style nút lưu
                onPress={handleSaveBranch} // Gọi hàm lưu chi nhánh
              >
                <Text style={styles.saveButtonText}>Lưu</Text> {/* Văn bản nút lưu */}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal sửa chi nhánh */}
      <Modal
        visible={showEditModal} // Hiển thị modal khi showEditModal = true
        animationType="slide" // Hiệu ứng trượt từ dưới lên
        transparent={true} // Modal trong suốt
      >
        <TouchableOpacity 
          style={styles.modalContainer} // Container modal có thể nhấn
          activeOpacity={1} // Không thay đổi độ trong suốt khi nhấn
          onPress={() => setShowEditModal(false)} // Đóng modal khi nhấn vào vùng ngoài
        >
          <TouchableOpacity 
            style={styles.modalContent} // Nội dung modal
            activeOpacity={1} // Không thay đổi độ trong suốt
            onPress={(e) => e.stopPropagation()} // Ngăn không cho sự kiện truyền lên parent
          >
            <Text style={styles.modalTitle}>Sửa chi nhánh</Text> {/* Tiêu đề modal sửa */}
            
            <TextInput
              style={styles.modalInput} // Style input
              placeholder="Tên chi nhánh" // Placeholder cho tên
              value={branchName} // Giá trị tên chi nhánh hiện tại
              onChangeText={setBranchName} // Cập nhật tên chi nhánh
            />
            
            <TextInput
              style={styles.modalInput} // Style input
              placeholder="Địa chỉ chi nhánh" // Placeholder cho địa chỉ
              value={branchAddress} // Giá trị địa chỉ chi nhánh hiện tại
              onChangeText={setBranchAddress} // Cập nhật địa chỉ chi nhánh
              multiline // Cho phép nhiều dòng
            />
            
            <View style={styles.modalActions}> {/* Container các nút hành động */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} // Style nút hủy
                onPress={() => setShowEditModal(false)} // Đóng modal khi nhấn hủy
              >
                <Text style={styles.cancelButtonText}>Hủy</Text> {/* Văn bản nút hủy */}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} // Style nút cập nhật
                onPress={handleUpdateBranch} // Gọi hàm cập nhật chi nhánh
              >
                <Text style={styles.saveButtonText}>Cập nhật</Text> {/* Văn bản nút cập nhật */}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal xác nhận đăng xuất */}
      <Modal
        visible={showLogoutModal} // Hiển thị modal khi showLogoutModal = true
        animationType="slide" // Hiệu ứng trượt từ dưới lên
        transparent={true} // Modal trong suốt
      >
        <TouchableOpacity 
          style={styles.modalContainer} // Container modal có thể nhấn
          activeOpacity={1} // Không thay đổi độ trong suốt khi nhấn
          onPress={() => setShowLogoutModal(false)} // Đóng modal khi nhấn vào vùng ngoài
        >
          <TouchableOpacity 
            style={styles.modalContent} // Nội dung modal
            activeOpacity={1} // Không thay đổi độ trong suốt
            onPress={(e) => e.stopPropagation()} // Ngăn không cho sự kiện truyền lên parent
          >
            <Text style={styles.modalTitle}>Xác nhận đăng xuất</Text> {/* Tiêu đề modal */}
            <Text style={styles.confirmText}>Bạn có chắc chắn muốn đăng xuất?</Text> {/* Nội dung xác nhận */}
            
            <View style={styles.modalActions}> {/* Container các nút hành động */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} // Style nút hủy
                onPress={() => setShowLogoutModal(false)} // Đóng modal khi nhấn hủy
              >
                <Text style={styles.cancelButtonText}>Hủy</Text> {/* Văn bản nút hủy */}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.dangerButton]} // Style nút đăng xuất (màu đỏ)
                onPress={confirmLogout} // Gọi hàm xác nhận đăng xuất
              >
                <Text style={styles.dangerButtonText}>Đăng xuất</Text> {/* Văn bản nút đăng xuất */}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal xác nhận xóa chi nhánh */}
      <Modal
        visible={showDeleteModal} // Hiển thị modal khi showDeleteModal = true
        animationType="slide" // Hiệu ứng trượt từ dưới lên
        transparent={true} // Modal trong suốt
      >
        <TouchableOpacity 
          style={styles.modalContainer} // Container modal có thể nhấn
          activeOpacity={1} // Không thay đổi độ trong suốt khi nhấn
          onPress={() => setShowDeleteModal(false)} // Đóng modal khi nhấn vào vùng ngoài
        >
          <TouchableOpacity 
            style={styles.modalContent} // Nội dung modal
            activeOpacity={1} // Không thay đổi độ trong suốt
            onPress={(e) => e.stopPropagation()} // Ngăn không cho sự kiện truyền lên parent
          >
            <Text style={styles.modalTitle}>Xác nhận xóa</Text> {/* Tiêu đề modal */}
            <Text style={styles.confirmText}>
              Bạn có chắc chắn muốn xóa chi nhánh &quot;{deletingBranch?.ten}&quot;? {/* Hiển thị tên chi nhánh cần xóa */}
            </Text>
            <Text style={styles.warningText}>Không thể hoàn tác.</Text> {/* Cảnh báo */}
            
            <View style={styles.modalActions}> {/* Container các nút hành động */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} // Style nút hủy
                onPress={() => setShowDeleteModal(false)} // Đóng modal khi nhấn hủy
              >
                <Text style={styles.cancelButtonText}>Hủy</Text> {/* Văn bản nút hủy */}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.dangerButton]} // Style nút xóa (màu đỏ)
                onPress={confirmDeleteBranch} // Gọi hàm xác nhận xóa chi nhánh
              >
                <Text style={styles.dangerButtonText}>Xóa</Text> {/* Văn bản nút xóa */}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View> // Kết thúc container
  );
}

const styles = StyleSheet.create({ // Style cho giao diện
  container: { flex: 1, backgroundColor: Colors.background }, // Container toàn màn hình
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // Style cho loading
  header: { padding: 16, backgroundColor: Colors.primary }, // Style header
  headerText: { fontSize: 24, fontWeight: 'bold', color: Colors.white }, // Style chào mừng
  email: { fontSize: 14, color: Colors.white }, // Style email
  branchItem: { padding: 16, margin: 8, backgroundColor: Colors.white, borderRadius: 12 }, // Style card chi nhánh
  branchName: { fontSize: 16, fontWeight: '600', color: Colors.primary }, // Style tên chi nhánh
  branchAddress: { fontSize: 14, color: Colors.gray, marginTop: 4 }, // Style địa chỉ chi nhánh
  loadingText: { fontSize: 16, color: Colors.gray }, // Style văn bản loading
  // Modal styles
  modalContainer: { // Container modal với overlay
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { // Nội dung modal
    backgroundColor: Colors.white, 
    padding: 20, 
    borderRadius: 12, 
    width: '80%', 
    maxWidth: 400 
  },
  modalTitle: { // Tiêu đề modal
    fontSize: 18, 
    fontWeight: 'bold', 
    color: Colors.primary, 
    textAlign: 'center', 
    marginBottom: 20 
  },
  modalInput: { // Input trong modal
    borderWidth: 1, 
    borderColor: Colors.gray, 
    padding: 12, 
    marginBottom: 15, 
    borderRadius: 8, 
    fontSize: 16 
  },
  modalActions: { // Container các nút hành động
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  modalButton: { // Style chung cho nút modal
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 8, 
    minWidth: 80 
  },
  cancelButton: { backgroundColor: Colors.gray }, // Style nút hủy
  saveButton: { backgroundColor: Colors.primary }, // Style nút lưu
  dangerButton: { backgroundColor: '#dc3545' }, // Style nút nguy hiểm (đỏ) cho đăng xuất và xóa
  cancelButtonText: { color: Colors.white, textAlign: 'center', fontWeight: 'bold' }, // Văn bản nút hủy
  saveButtonText: { color: Colors.white, textAlign: 'center', fontWeight: 'bold' }, // Văn bản nút lưu
  dangerButtonText: { color: Colors.white, textAlign: 'center', fontWeight: 'bold' }, // Văn bản nút nguy hiểm
  confirmText: { // Style cho text xác nhận
    fontSize: 16, 
    color: Colors.text, 
    textAlign: 'center', 
    marginBottom: 8,
    lineHeight: 22
  },
  warningText: { // Style cho text cảnh báo
    fontSize: 14, 
    color: '#dc3545', 
    textAlign: 'center', 
    fontStyle: 'italic',
    marginBottom: 20
  },
  // Action button styles
  actionButton: { // Style cho nút hành động trong card chi nhánh
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center'
  },
  deleteButton: { // Style riêng cho nút xóa
    backgroundColor: '#dc3545'
  },
  actionButtonText: { // Text cho nút hành động
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14
  },
  deleteButtonText: { // Text cho nút xóa
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  darkModeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkModeIcon: {
    fontSize: 20,
  }
});