import React, { useState } from 'react'; // Nhập React và useState để quản lý trạng thái form
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native'; // Nhập các thành phần giao diện
import { useRouter } from 'expo-router'; // Nhập useRouter để điều hướng
import { Colors } from '../app-example/constants/Colors'; // Nhập Colors để sử dụng màu sắc

// Placeholder cho AuthService
const AuthService = {
  signin: async (email, password) => { return true; }, // Giả lập đăng nhập thành công
  signInWithGoogle: async () => { /* Giả lập Google sign-in */ },
};

export default function LoginScreen() {
  const [email, setEmail] = useState(''); // Trạng thái cho email người dùng nhập
  const [password, setPassword] = useState(''); // Trạng thái cho mật khẩu
  const router = useRouter(); // Hook để điều hướng

  const handleSignIn = async () => { // Hàm xử lý đăng nhập bằng email/mật khẩu
    const success = await AuthService.signin(email, password); // Gọi API đăng nhập
    if (success) { // Nếu thành công, chuyển sang tabs
      router.replace('/(tabs)/'); // Điều hướng đến tabs (Đã_đăng_nhập)
    } else { // Nếu thất bại, hiển thị lỗi
      alert('Đăng nhập thất bại'); // Hiển thị lỗi (Lỗi_đăng_nhập)
    }
  };

  const handleGoogleSignIn = async () => { // Hàm xử lý đăng nhập bằng Google
    if (Platform.OS === 'ios') { // Kiểm tra nếu chạy trên iOS
      console.log('Đang chạy trên iOS Simulator - Bỏ qua Google Sign-In'); // Bỏ qua Google sign-in trên simulator
      return;
    }
    await AuthService.signInWithGoogle(); // Gọi API Google sign-in
    router.replace('/(tabs)/'); // Chuyển đến tabs nếu thành công
  };

  const handleSignup = () => { // Hàm chuyển hướng sang màn hình đăng ký
    router.push('/Register'); // Chuyển từ Đăng_nhập sang Đăng_ký
  };

  return (
    <View style={styles.container}> {/* Container chính cho giao diện */}
      <Text style={styles.title}>Chào mừng trở lại</Text> {/* Tiêu đề màn hình */}
      <TextInput
        style={styles.input}
        placeholder="email@example.com"
        value={email}
        onChangeText={setEmail}
      /> {/* Trường nhập email */}
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      /> {/* Trường nhập mật khẩu */}
      <Button title="Đăng Nhập" onPress={handleSignIn} color={Colors.primary} /> {/* Nút đăng nhập, gọi handleSignIn */}
      <Button title="Đăng nhập với Google" onPress={handleGoogleSignIn} color={Colors.white} /> {/* Nút Google sign-in */}
      <TouchableOpacity onPress={handleSignup}> {/* Nút chuyển sang màn hình đăng ký */}
        <Text style={styles.link}>Người dùng mới? Tạo tài khoản</Text> {/* Văn bản liên kết */}
      </TouchableOpacity> {/* Kết thúc liên kết đăng ký */}
    </View> // Kết thúc container
  );
}

const styles = StyleSheet.create({ // Định nghĩa style cho giao diện
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: Colors.white }, // Container căn giữa, nền trắng
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: Colors.black }, // Style tiêu đề
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 14, borderColor: Colors.gray }, // Style trường nhập
  link: { color: Colors.primary, textAlign: 'center', marginTop: 20 }, // Style liên kết đăng ký
});