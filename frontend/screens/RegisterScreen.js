import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../app-example/constants/Colors';
import { AuthService } from '../services/api';

export default function RegisterScreen() {
  const { accountType } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [representative, setRepresentative] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }
    
    if (accountType === 'business' && (!companyName || !address || !representative || !phone)) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin doanh nghiệp');
      return;
    }
    
    if (accountType === 'personal' && !name) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đầy đủ');
      return;
    }

    try {
      setLoading(true);
      
      // Chuẩn bị data theo format backend yêu cầu
      let data = {
        email,
        matkhau: password,
        loai_tai_khoan: accountType,
      };
      
      if (accountType === 'business') {
        data = {
          ...data,
          ten: companyName, // tên công ty
          diachi: address,
          nguoidaidien: representative,
          sodienthoai: phone,
        };
      } else {
        data = {
          ...data,
          ten: name, // tên cá nhân
          diachi: address || 'N/A',
          sodienthoai: phone || '0000000000',
        };
      }
      
      const response = await AuthService.register(data);
      
      if (response && response.user) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
          {
            text: 'OK',
            onPress: () => {
              // Điều hướng dựa theo loại tài khoản
              if (response.user.loai_tai_khoan === 'business') {
                router.replace('/MainScreen');
              } else {
                router.replace('/app-example/app/(tabs)/');
              }
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Đăng ký thất bại', error.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.back(); // Quay lại màn hình trước đó (LoginScreen)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản {accountType === 'business' ? 'doanh nghiệp' : 'cá nhân'}</Text>
      <View style={styles.formContainer}>
        {accountType === 'business' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Tên công ty"
              value={companyName}
              onChangeText={setCompanyName}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Mã số thuế"
              value={taxCode}
              onChangeText={setTaxCode}
            />
            <TextInput
              style={styles.input}
              placeholder="Người đại diện"
              value={representative}
              onChangeText={setRepresentative}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
            />
          </>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Tên đầy đủ"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button 
          title={loading ? "Đang đăng ký..." : "Đăng ký"} 
          onPress={handleSignup} 
          disabled={loading}
          color={Colors.primary} 
        />
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.linkContainer}>
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
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