import React, { useState } from 'react'; // Nhập React và useState để quản lý form
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'; // Nhập các thành phần giao diện
import { useRouter } from 'expo-router'; // Nhập useRouter để điều hướng
import { Colors } from '../app-example/constants/Colors'; // Nhập Colors để sử dụng màu sắc

// Placeholder cho AuthService
const AuthService = {
  signup: async (data) => { return true; }, // Giả lập đăng ký thành công
};

export default function RegisterScreen() {
  const [accountType, setAccountType] = useState(null); // Trạng thái loại tài khoản (Chọn_loai_tai_khoan)
  const [name, setName] = useState(''); // Tên (cho cá nhân)
  const [email, setEmail] = useState(''); // Email
  const [password, setPassword] = useState(''); // Mật khẩu
  const [companyName, setCompanyName] = useState(''); // Tên công ty (doanh nghiệp)
  const [address, setAddress] = useState(''); // Địa chỉ (doanh nghiệp)
  const [taxCode, setTaxCode] = useState(''); // Mã số thuế (doanh nghiệp)
  const [representative, setRepresentative] = useState(''); // Người đại diện (doanh nghiệp)
  const [phone, setPhone] = useState(''); // Số điện thoại (doanh nghiệp)
  const router = useRouter(); // Hook điều hướng

  const handleSelectType = (type) => { // Hàm chọn loại tài khoản
    setAccountType(type); // Cập nhật trạng thái, chuyển sang Nhập_thông_tin_CN hoặc Nhập_thông_tin_DN
  };

  const handleSignup = async () => { // Hàm xử lý đăng ký
    let data = { email, password, accountType }; // Dữ liệu cơ bản
    if (accountType === 'business') { // Nếu là doanh nghiệp, thêm các trường đặc thù
      data = { ...data, companyName, address, taxCode, representative, phone }; // Nhập_thông_tin_DN
    } else { // Nếu là cá nhân, thêm tên
      data = { ...data, name }; // Nhập_thông_tin_CN
    }
    const success = await AuthService.signup(data); // Gọi API đăng ký
    if (success) { // Nếu thành công, chuyển về LoginScreen
      router.replace('Login'); // Chuyển sang Đăng_nhập (Chờ_xác_nhận_email)
    } else { // Nếu thất bại, hiển thị lỗi
      alert('Đăng ký thất bại');
    }
  };

  const handleLogin = () => { // Hàm chuyển hướng về đăng nhập
    router.push('Login'); // Chuyển từ Đăng_ký sang Đăng_nhập
  };

  return (
    <View style={styles.container}> {/* Container chính */}
      <Text style={styles.title}>Đăng ký tài khoản</Text> {/* Tiêu đề */}
      {!accountType ? ( // Nếu chưa chọn loại tài khoản, hiển thị lựa chọn
        <View>
          <Button
            title="Tài khoản cá nhân"
            onPress={() => handleSelectType('personal')} // Chọn cá nhân (Chọn_loai_tai_khoan -> Nhập_thông_tin_CN)
            color={Colors.primary}
          />
          <Button
            title="Tài khoản doanh nghiệp"
            onPress={() => handleSelectType('business')} // Chọn doanh nghiệp (Chọn_loai_tai_khoan -> Nhập_thông_tin_DN)
            color={Colors.primary}
          />
        </View>
      ) : ( // Nếu đã chọn, hiển thị form tương ứng
        <View>
          {accountType === 'business' ? ( // Form cho doanh nghiệp
            <>
              <TextInput
                style={styles.input}
                placeholder="Tên công ty"
                value={companyName}
                onChangeText={setCompanyName}
              /> {/* Trường nhập tên công ty */}
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={address}
                onChangeText={setAddress}
              /> {/* Trường nhập địa chỉ */}
              <TextInput
                style={styles.input}
                placeholder="Mã số thuế"
                value={taxCode}
                onChangeText={setTaxCode}
              /> {/* Trường nhập mã số thuế */}
              <TextInput
                style={styles.input}
                placeholder="Người đại diện"
                value={representative}
                onChangeText={setRepresentative}
              /> {/* Trường nhập người đại diện */}
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
              /> {/* Trường nhập số điện thoại */}
            </>
          ) : ( // Form cho cá nhân
            <TextInput
              style={styles.input}
              placeholder="Tên đầy đủ"
              value={name}
              onChangeText={setName}
            /> // Trường nhập tên
          )}
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
          /> {/* Trường nhập email (chung) */}
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          /> {/* Trường nhập mật khẩu (chung) */}
          <Button title="Đăng ký" onPress={handleSignup} color={Colors.primary} /> {/* Nút đăng ký, gọi handleSignup */}
        </View>
      )}
      <TouchableOpacity onPress={handleLogin}> {/* Liên kết về đăng nhập */}
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text> {/* Văn bản liên kết */}
      </TouchableOpacity> {/* Kết thúc liên kết */}
    </View> // Kết thúc container
  );
}

const styles = StyleSheet.create({ // Style cho giao diện
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: Colors.white }, // Container căn giữa, nền trắng
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: Colors.black }, // Style tiêu đề
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 14, borderColor: Colors.gray }, // Style trường nhập
  link: { color: Colors.primary, textAlign: 'center', marginTop: 20 }, // Style liên kết
});