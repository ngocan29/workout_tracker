import React, { useState } from 'react'; // Nhập React và useState để quản lý trạng thái form
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native'; // Nhập các thành phần giao diện
import { useRouter } from 'expo-router'; // Nhập useRouter để điều hướng
import { Colors } from '../app-example/constants/Colors'; // Nhập Colors để sử dụng màu sắc
import { AuthService } from '../services/api'; // Nhập AuthService từ API service

export default function LoginScreen() {
  const [email, setEmail] = useState(''); // Trạng thái cho email người dùng nhập
  const [password, setPassword] = useState(''); // Trạng thái cho mật khẩu
  const [loading, setLoading] = useState(false); // Trạng thái loading khi đăng nhập
  const router = useRouter(); // Hook để điều hướng

  const handleSignIn = async () => { // Hàm xử lý đăng nhập bằng email/mật khẩu
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting login with:', { email, password: '***' });
      console.log('API Base URL:', 'http://localhost:5000');
      
      const response = await AuthService.login(email, password); // Gọi API đăng nhập thật
      console.log('Login response:', response);
      
      if (response && response.user) { // Nếu thành công
        console.log('Login successful, user type:', response.user.loai_tai_khoan);
        // Kiểm tra loại tài khoản và điều hướng phù hợp
        if (response.user.loai_tai_khoan === 'business') {
          router.replace('/MainScreen'); // Chuyển đến MainScreen cho business
        } else {
          router.replace('/app-example/app/(tabs)/'); // Chuyển đến tabs cho personal
        }
      }
    } catch (error) {
      console.error('Login error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Nếu user chưa tồn tại, gợi ý đăng ký
      if (error.message === 'Invalid email or password') {
        Alert.alert('Đăng nhập thất bại', 
          'Email hoặc mật khẩu không đúng.\n\nBạn có muốn đăng ký tài khoản mới không?',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Đăng ký', onPress: () => router.push('/AccountTypeSelection') }
          ]
        );
      } else {
        Alert.alert('Đăng nhập thất bại', 
          `Lỗi: ${error.message || 'Không thể kết nối đến server'}\n\nVui lòng kiểm tra:\n- Backend server đã chạy?\n- Port 5000 có trống?`
        ); 
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => { // Hàm xử lý đăng nhập bằng Google
    if (Platform.OS === 'ios') { // Kiểm tra nếu chạy trên iOS
      console.log('Đang chạy trên iOS Simulator - Bỏ qua Google Sign-In'); // Bỏ qua Google sign-in trên simulator
      return;
    }
    Alert.alert('Thông báo', 'Tính năng Google Sign-In sẽ được phát triển trong tương lai');
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
        <Button 
          title={loading ? "Đang đăng nhập..." : "Đăng Nhập"} 
          onPress={handleSignIn} 
          disabled={loading}
          color={Colors.primary} 
        />
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