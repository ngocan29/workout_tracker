import React, { useState } from 'react'; // Nhập React và useState để quản lý form
import { View, Text, TextInput, Button, StyleSheet, Alert, Picker } from 'react-native'; // Nhập các thành phần giao diện
import { useRouter, useLocalSearchParams } from 'expo-router'; // Nhập useRouter và useLocalSearchParams để điều hướng và lấy params
import { Colors } from '../app-example/constants/Colors'; // Nhập Colors để sử dụng màu sắc

// Placeholder cho API cập nhật hồ sơ
const updateProfile = async (data) => { return data; }; // Giả lập cập nhật thành công

export default function EditProfileScreen() {
  const router = useRouter(); // Hook điều hướng
  const { userData } = useLocalSearchParams(); // Lấy userData từ params
  const parsedUserData = userData ? JSON.parse(userData) : {}; // Parse userData từ JSON
  const isBusiness = parsedUserData.userRole === 'business'; // Kiểm tra loại tài khoản

  const [ten, setTen] = useState(parsedUserData.ten || ''); // Tên (cá nhân) hoặc tên công ty (doanh nghiệp)
  const [sodienthoai, setSodienthoai] = useState(parsedUserData.sodienthoai || ''); // Số điện thoại
  const [diachi, setDiachi] = useState(parsedUserData.diachi || ''); // Địa chỉ
  const [email, setEmail] = useState(parsedUserData.email || ''); // Email (chỉ đọc)
  const [masothue, setMasothue] = useState(parsedUserData.masothue || ''); // Mã số thuế (doanh nghiệp)
  const [nguoidaidien, setNguoidaidien] = useState(parsedUserData.nguoidaidien || ''); // Người đại diện (doanh nghiệp)
  const [cccd, setCccd] = useState(parsedUserData.CCCD || ''); // CCCD (cá nhân)
  const [ngaysinh, setNgaysinh] = useState(parsedUserData.ngaysinh || ''); // Ngày sinh (cá nhân)
  const [gioiTinh, setGioiTinh] = useState(parsedUserData.gioitinh || 'Nam'); // Giới tính (cá nhân)

  const handleSave = async () => { // Hàm lưu thay đổi hồ sơ
    const updatedData = { // Tạo dữ liệu cập nhật
      email,
      ten,
      sodienthoai,
      diachi,
      userRole: isBusiness ? 'business' : 'personal',
      ...(isBusiness ? { masothue, nguoidaidien } : { CCCD: cccd, ngaysinh, gioiTinh })
    };
    const result = await updateProfile(updatedData); // Gọi API cập nhật
    if (result) { // Nếu thành công, quay lại MainScreen
      router.back(); // Đóng màn hình và quay lại HomeTab
    } else { // Nếu thất bại, hiển thị lỗi
      Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ');
    }
  };

  return (
    <View style={styles.container}> {/* Container chính */}
      <Text style={styles.title}>
        {isBusiness ? 'Cập nhật thông tin doanh nghiệp' : 'Cập nhật thông tin cá nhân'} {/* Tiêu đề tùy loại tài khoản */}
      </Text>
      {isBusiness ? ( // Form cho doanh nghiệp
        <>
          <TextInput
            style={styles.input}
            placeholder="Tên công ty"
            value={ten}
            onChangeText={setTen}
          /> {/* Trường tên công ty */}
          <TextInput
            style={styles.input}
            placeholder="Mã số thuế"
            value={masothue}
            onChangeText={setMasothue}
          /> {/* Trường mã số thuế */}
          <TextInput
            style={styles.input}
            placeholder="Người đại diện"
            value={nguoidaidien}
            onChangeText={setNguoidaidien}
          /> {/* Trường người đại diện */}
        </>
      ) : ( // Form cho cá nhân
        <>
          <TextInput
            style={styles.input}
            placeholder="Họ tên"
            value={ten}
            onChangeText={setTen}
          /> {/* Trường họ tên */}
          <TextInput
            style={styles.input}
            placeholder="CCCD"
            value={cccd}
            onChangeText={setCccd}
            keyboardType="numeric"
          /> {/* Trường CCCD */}
          <TextInput
            style={styles.input}
            placeholder="Ngày sinh (dd/mm/yyyy)"
            value={ngaysinh}
            onChangeText={setNgaysinh}
          /> {/* Trường ngày sinh (placeholder cho date picker) */}
          <Picker
            selectedValue={gioiTinh}
            onValueChange={(value) => setGioiTinh(value)}
            style={styles.input}
          > {/* Dropdown giới tính */}
            <Picker.Item label="Nam" value="Nam" />
            <Picker.Item label="Nữ" value="Nữ" />
          </Picker> {/* Kết thúc dropdown */}
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={sodienthoai}
        onChangeText={setSodienthoai}
        keyboardType="phone-pad"
      /> {/* Trường số điện thoại (chung) */}
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={diachi}
        onChangeText={setDiachi}
      /> {/* Trường địa chỉ (chung) */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false}
      /> {/* Trường email (chỉ đọc) */}
      <View style={styles.actions}> {/* Container cho các nút hành động */}
        <Button title="Hủy" onPress={() => router.back()} color={Colors.gray} /> {/* Nút hủy, quay lại HomeTab */}
        <Button title="Lưu thay đổi" onPress={handleSave} color={Colors.primary} /> {/* Nút lưu, gọi handleSave */}
      </View> {/* Kết thúc actions */}
    </View> // Kết thúc container
  );
}

const styles = StyleSheet.create({ // Style cho giao diện
  container: { flex: 1, padding: 24, backgroundColor: Colors.white }, // Container toàn màn hình
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, textAlign: 'center', marginBottom: 16 }, // Style tiêu đề
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 12, borderColor: Colors.gray }, // Style trường nhập
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }, // Style container nút
});