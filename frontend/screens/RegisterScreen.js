import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../app-example/constants/Colors';
import { AuthService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Load dark mode state từ AsyncStorage
  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
        if (savedDarkMode !== null) {
          setIsDarkMode(JSON.parse(savedDarkMode));
        }
      } catch (error) {
        console.log('Error loading dark mode:', error);
      }
    };
    loadDarkMode();
  }, []);

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
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? Colors.darkText : Colors.black }]}>Đăng ký tài khoản {accountType === 'business' ? 'doanh nghiệp' : 'cá nhân'}</Text>
        <TouchableOpacity 
          style={[styles.darkModeButton, { backgroundColor: isDarkMode ? Colors.darkGreen : Colors.lightGreen }]}
          onPress={toggleDarkMode}
        >
          <Text style={styles.darkModeIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        {accountType === 'business' ? (
          <>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]}
              placeholder="Tên công ty"
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={companyName}
              onChangeText={setCompanyName}
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]}
              placeholder="Địa chỉ"
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]}
              placeholder="Mã số thuế"
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={taxCode}
              onChangeText={setTaxCode}
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]}
              placeholder="Người đại diện"
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={representative}
              onChangeText={setRepresentative}
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]}
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
        <Text style={[styles.link, { color: isDarkMode ? Colors.darkGreen : Colors.primary }]}>Đã có tài khoản? Đăng nhập</Text>
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
  link: { fontSize: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  darkModeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  darkModeIcon: {
    fontSize: 20,
  }
});