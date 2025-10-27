import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/Colors';
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
  const [gender, setGender] = useState('male'); // Thêm state cho giới tính
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

    // Validation số điện thoại
    if (phone && (!/^[0-9]{10,11}$/.test(phone))) {
      Alert.alert('Lỗi', 'Số điện thoại phải có 10-11 chữ số');
      return;
    }

    try {
      setLoading(true);
      
      // Chuẩn bị data theo format backend yêu cầu
      let data = {
        email,
        matkhau: password,
        loai_tai_khoan: accountType,
        ngayvao: new Date().toISOString(), // Thêm ngày vào
        chuoi: 0, // Thêm chuỗi mặc định
        gioitinh: accountType === 'business' ? 'male' : gender, // Business mặc định male, personal theo lựa chọn
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
          diachi: address || 'Chưa cập nhật',
          sodienthoai: phone || '0000000000', // 10 chữ số hợp lệ
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
                router.replace('/(tabs)');
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
              placeholder="Số điện thoại (10-11 chữ số)"
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={phone}
              onChangeText={setPhone}
              keyboardType="numeric"
              maxLength={11}
            />
          </>
        ) : (
          <>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]}
              placeholder="Tên đầy đủ"
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={name}
              onChangeText={setName}
            />
            
            {/* Trường chọn giới tính */}
            <View style={[styles.pickerContainer, { 
              backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
              borderColor: isDarkMode ? Colors.darkSecondary : '#ddd'
            }]}>
              <Text style={[styles.pickerLabel, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>Giới tính:</Text>
              <Picker
                selectedValue={gender}
                onValueChange={setGender}
                style={[styles.picker, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}
              >
                <Picker.Item label="Nam" value="male" />
                <Picker.Item label="Nữ" value="female" />
              </Picker>
            </View>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]}
              placeholder="Số điện thoại (tùy chọn, 10-11 chữ số)"
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={phone}
              onChangeText={setPhone}
              keyboardType="numeric"
              maxLength={11}
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                borderColor: isDarkMode ? Colors.darkSecondary : '#ddd',
                color: isDarkMode ? Colors.darkText : Colors.black
              }]}
              placeholder="Địa chỉ (tùy chọn)"
              placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
              value={address}
              onChangeText={setAddress}
            />
          </>
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 14,
    marginVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 10,
    minWidth: 80,
  },
  picker: {
    flex: 1,
    height: 50,
  },
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