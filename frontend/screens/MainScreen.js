import React, { useState, useEffect } from 'react'; // Nhập React, useState, useEffect để quản lý trạng thái và fetch dữ liệu
import { View, Text, Button, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native'; // Nhập các thành phần giao diện
import { useRouter } from 'expo-router'; // Nhập useRouter từ expo-router để điều hướng
import { Colors } from '../app-example/constants/Colors'; // Nhập Colors để sử dụng màu sắc

// Placeholder cho AuthService và API fetching
const AuthService = { signout: async () => { /* Giả lập đăng xuất */ } };
const fetchUserData = async () => { // Giả lập dữ liệu người dùng và chi nhánh
  return {
    userRole: 'business', // Loại tài khoản (business/personal)
    ten: 'User Name',
    email: 'example@email.com',
    branches: [{ id: '1', ten: 'Chi nhánh 1' }, { id: '2', ten: 'Chi nhánh 2' }]
  };
};

export default function MainScreen() {
  const [userData, setUserData] = useState(null); // Trạng thái cho dữ liệu người dùng
  const [branches, setBranches] = useState([]); // Trạng thái cho danh sách chi nhánh
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới danh sách
  const router = useRouter(); // Hook điều hướng

  useEffect(() => { // Hook để tải dữ liệu khi màn hình khởi tạo
    loadData(); // Gọi hàm tải dữ liệu (Trang_chủ_chung)
  }, []); // Chỉ chạy một lần khi mount

  const loadData = async () => { // Hàm tải dữ liệu người dùng và chi nhánh
    setLoading(true); // Bắt đầu trạng thái tải
    const data = await fetchUserData(); // Gọi API giả lập
    setUserData(data); // Cập nhật dữ liệu người dùng
    setBranches(data.branches || []); // Cập nhật danh sách chi nhánh
    setLoading(false); // Kết thúc trạng thái tải
  };

  const handleRefresh = async () => { // Hàm làm mới danh sách chi nhánh
    setRefreshing(true); // Bắt đầu làm mới
    await loadData(); // Tải lại dữ liệu
    setRefreshing(false); // Kết thúc làm mới
  };

  const handleLogout = async () => { // Hàm xử lý đăng xuất
    await AuthService.signout(); // Gọi API đăng xuất
    router.replace('/'); // Chuyển về Đăng_nhập (Chưa_đăng_nhập)
  };

  const handleEditProfile = () => { // Hàm mở màn hình chỉnh sửa hồ sơ (business only)
    router.push({ pathname: '/EditProfile', params: { userData: JSON.stringify(userData) } }); // Điều hướng đến EditProfileScreen
  };

  const handleAddBranch = () => { // Hàm thêm chi nhánh mới (business only)
    Alert.prompt('Thêm chi nhánh', 'Tên chi nhánh', (name) => { // Hiển thị prompt nhập tên
      setBranches([...branches, { id: Date.now().toString(), ten: name }]); // Giả lập thêm chi nhánh
    });
  };

  const handleEditBranch = (branch) => { // Hàm chỉnh sửa chi nhánh
    Alert.prompt('Chỉnh sửa chi nhánh', 'Tên mới', (newName) => { // Hiển thị prompt nhập tên mới
      setBranches(branches.map(b => b.id === branch.id ? { ...b, ten: newName } : b)); // Giả lập cập nhật
    });
  };

  const handleDeleteBranch = (branch) => { // Hàm xóa chi nhánh
    Alert.alert('Xác nhận', `Xóa chi nhánh "${branch.ten}"?`, [ // Hiển thị dialog xác nhận
      { text: 'Hủy' },
      { text: 'Xóa', onPress: () => { // Xác nhận xóa
        setBranches(branches.filter(b => b.id !== branch.id)); // Giả lập xóa
      }}
    ]);
  };

  if (loading) { // Nếu đang tải, hiển thị loading
    return (
      <View style={styles.center}> {/* Container căn giữa cho loading */}
        <Text style={styles.loadingText}>Đang tải...</Text> {/* Văn bản loading */}
      </View>
    );
  }

  return (
    <View style={styles.container}> {/* Container chính */}
      <View style={styles.header}> {/* Header hiển thị thông tin người dùng */}
        <Text style={styles.headerText}>Xin chào, {userData?.ten}</Text> {/* Chào mừng người dùng */}
        <Text style={styles.email}>{userData?.email}</Text> {/* Hiển thị email */}
        {userData?.userRole === 'business' && ( // Nếu là business, hiển thị nút chỉnh sửa hồ sơ
          <Button title="Chỉnh sửa hồ sơ" onPress={handleEditProfile} color={Colors.primary} /> // Nút mở EditProfileScreen
        )}
        <Button title="Đăng xuất" onPress={handleLogout} color={Colors.accent} /> {/* Nút đăng xuất */}
      </View> {/* Kết thúc header */}
      <FlatList // Danh sách chi nhánh
        data={branches} // Dữ liệu chi nhánh
        keyExtractor={(item) => item.id.toString()} // Key cho từng item
        renderItem={({ item }) => ( // Render mỗi chi nhánh
          <View style={styles.branchItem}> {/* Card chi nhánh */}
            <Text style={styles.branchName}>{item.ten}</Text> {/* Tên chi nhánh */}
            {userData?.userRole === 'business' ? ( // Nếu là business, hiển thị nút quản lý (Dashboard_business)
              <>
                <Button title="Sửa" onPress={() => handleEditBranch(item)} color={Colors.primary} /> {/* Nút sửa */}
                <Button title="Xóa" onPress={() => handleDeleteBranch(item)} color={Colors.accent} /> {/* Nút xóa */}
              </>
            ) : null} {/* Personal không có nút quản lý (Dashboard_personal) */}
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />} // Kéo để làm mới danh sách
      /> {/* Kết thúc FlatList */}
      {userData?.userRole === 'business' && ( // Nếu là business, hiển thị nút thêm chi nhánh
        <Button title="Thêm chi nhánh" onPress={handleAddBranch} color={Colors.primary} /> // Nút thêm chi nhánh
      )} {/* Kết thúc nút thêm */}
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
  loadingText: { fontSize: 16, color: Colors.gray }, // Style văn bản loading
});