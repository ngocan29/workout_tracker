import React, { useState } from 'react'; // Nhập React và useState để quản lý form
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native'; // Nhập các thành phần giao diện
import { useRouter, useLocalSearchParams } from 'expo-router'; // Nhập useRouter và useLocalSearchParams để điều hướng và lấy params
import { Colors } from '../app-example/constants/Colors'; // Nhập Colors để sử dụng màu sắc
import { AuthService } from '../services/api'; // Nhập AuthService từ API service

export default function EditProfileScreen() {
  const router = useRouter(); // Hook điều hướng
  const { userData } = useLocalSearchParams(); // Lấy userData từ params
  const parsedUserData = userData ? JSON.parse(userData) : {}; // Parse userData từ JSON
  const isBusiness = parsedUserData.loai_tai_khoan === 'business'; // Kiểm tra loại tài khoản

  const [ten, setTen] = useState(parsedUserData.ten || ''); // Tên (cá nhân) hoặc tên công ty (doanh nghiệp)
  const [sodienthoai, setSodienthoai] = useState(parsedUserData.sodienthoai || ''); // Số điện thoại
  const [diachi, setDiachi] = useState(parsedUserData.diachi || ''); // Địa chỉ
  const [email] = useState(parsedUserData.email || ''); // Email (chỉ đọc, không thể thay đổi)
  const [nguoidaidien, setNguoidaidien] = useState(parsedUserData.nguoidaidien || ''); // Người đại diện (doanh nghiệp)
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleSave = async () => { // Hàm lưu thay đổi hồ sơ
    if (!ten || !sodienthoai || !diachi) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (isBusiness && !nguoidaidien) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên người đại diện');
      return;
    }

    try {
      setLoading(true);
      
      const updatedData = { // Tạo dữ liệu cập nhật theo format backend
        ten,
        sodienthoai,
        diachi,
        ...(isBusiness ? { nguoidaidien } : {})
      };
      
      const result = await AuthService.updateProfile(updatedData); // Gọi API cập nhật thật
      
      if (result) { // Nếu thành công
        Alert.alert('Thành công', 'Cập nhật thông tin thành công!', [
          { text: 'OK', onPress: () => router.push('/(tabs)/MainScreen') } // Điều hướng về màn hình chính
        ]);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}> {/* Container chính với scroll */}
      <Text style={styles.title}>
        {isBusiness ? 'Cập nhật thông tin doanh nghiệp' : 'Cập nhật thông tin cá nhân'} {/* Tiêu đề tùy loại tài khoản */}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder={isBusiness ? "Tên công ty" : "Họ tên"}
        value={ten}
        onChangeText={setTen}
      /> {/* Trường tên */}
      
      {isBusiness && (
        <TextInput
          style={styles.input}
          placeholder="Người đại diện"
          value={nguoidaidien}
          onChangeText={setNguoidaidien}
        />
      )} {/* Trường người đại diện cho doanh nghiệp */}
      
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={sodienthoai}
        onChangeText={setSodienthoai}
        keyboardType="phone-pad"
      /> {/* Trường số điện thoại */}
      
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={diachi}
        onChangeText={setDiachi}
        multiline
      /> {/* Trường địa chỉ */}
      
      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="Email"
        value={email}
        editable={false}
      /> {/* Trường email (chỉ đọc) */}
      
      <View style={styles.actions}> {/* Container cho các nút hành động */}
        <Button title="Hủy" onPress={() => router.back()} color={Colors.gray} /> {/* Nút hủy */}
        <Button 
          title={loading ? "Đang lưu..." : "Lưu thay đổi"} 
          onPress={handleSave} 
          disabled={loading}
          color={Colors.primary} 
        /> {/* Nút lưu */}
      </View> {/* Kết thúc actions */}
    </ScrollView> 
  ); // Kết thúc component EditProfileScreen
}

const styles = StyleSheet.create({ // Style cho giao diện
  container: { flex: 1, padding: 24, backgroundColor: Colors.white }, // Container toàn màn hình
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 16 }, // Style tiêu đề
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 12, borderColor: Colors.gray }, // Style trường nhập
  disabledInput: { backgroundColor: Colors.lightGray, color: Colors.gray }, // Style cho input disabled
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 20 }, // Style container nút
});