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
      router.replace('/app-example/app/(tabs)/'); // Điều hướng đến tabs (Đã_đăng_nhập)
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
    router.replace('/app-example/app/(tabs)/'); // Chuyển đến tabs nếu thành công
  };

  const handleSignup = () => { // Hàm chuyển hướng sang màn hình chọn loại tài khoản
    router.push('/AccountTypeSelection'); // Chuyển từ Đăng_nhập sang Chọn_loai_tai_khoan
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng trở lại</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Đăng Nhập" onPress={handleSignIn} color={Colors.primary} />
        <Button title="Đăng nhập với Google" onPress={handleGoogleSignIn} color={Colors.white} />
      </View>
      <TouchableOpacity onPress={handleSignup} style={styles.linkContainer}>
        <Text style={styles.link}>Người dùng mới? Tạo tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: Colors.white },
  formContainer: { marginVertical: 10 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: Colors.black },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 14, borderColor: Colors.gray },
  linkContainer: { marginTop: 20, alignItems: 'center' },
  link: { color: Colors.primary, fontSize: 16 },
});