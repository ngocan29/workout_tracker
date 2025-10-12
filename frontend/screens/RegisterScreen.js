import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import Colors from '../app-example/constants/Colors';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ setCurrentScreen }) {
  const [registerType, setRegisterType] = useState('personal');

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('login')}>
          <ArrowLeft stroke={Colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng Ký Tài Khoản</Text>
      </View>
      <View style={styles.accountType}>
        <TouchableOpacity
          style={[styles.typeCard, registerType === 'personal' && styles.activeType]}
          onPress={() => setRegisterType('personal')}
        >
          <Text style={[styles.typeText, registerType === 'personal' && { color: Colors.primary }]}>Cá Nhân</Text>
          <Text style={styles.typeSubtitle}>Người dùng thường</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeCard, registerType === 'business' && styles.activeType]}
          onPress={() => setRegisterType('business')}
        >
          <Text style={[styles.typeText, registerType === 'business' && { color: Colors.secondary }]}>Doanh Nghiệp</Text>
          <Text style={styles.typeSubtitle}>Gym, PT, HLV</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        {registerType === 'personal' ? (
          <TextInput style={styles.input} placeholder="Họ và tên" placeholderTextColor={Colors.textLight} />
        ) : (
          <>
            <TextInput style={styles.input} placeholder="Tên doanh nghiệp" placeholderTextColor={Colors.textLight} />
            <Picker
              style={styles.picker}
              selectedValue="gym"
              onValueChange={(value) => console.log(value)}
            >
              <Picker.Item label="Phòng tập Gym" value="gym" />
              <Picker.Item label="Trung tâm Yoga" value="yoga" />
              <Picker.Item label="Huấn luyện viên cá nhân" value="personal" />
              <Picker.Item label="Trung tâm Fitness" value="fitness" />
              <Picker.Item label="Khác" value="other" />
            </Picker>
          </>
        )}
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.textLight} />
        <TextInput style={styles.input} placeholder="Số điện thoại" placeholderTextColor={Colors.textLight} />
        <TextInput style={styles.input} placeholder="Mật khẩu" placeholderTextColor={Colors.textLight} secureTextEntry />
        <TextInput style={styles.input} placeholder="Xác nhận mật khẩu" placeholderTextColor={Colors.textLight} secureTextEntry />
        <TouchableOpacity style={styles.submitButton} onPress={() => setCurrentScreen('main')}>
          <Text style={styles.submitButtonText}>Đăng Ký</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Đăng ký bằng Google</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('login')}>
          <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  accountType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  activeType: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}20`,
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  typeSubtitle: {
    fontSize: 12,
    color: Colors.textLight,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  linkText: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
  },
});