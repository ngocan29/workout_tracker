// src/screens/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../app-example/constants/Colors';

export default function LoginScreen({ setCurrentScreen }) {
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.card}>
        <Text style={[styles.title, { color: Colors.text }]}>FitTracker Pro</Text>
        <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          placeholderTextColor={Colors.textLight}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          placeholderTextColor={Colors.textLight}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('main')}>
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('register')}>
          <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: Colors.secondary,
    textAlign: 'center',
    fontSize: 14,
  },
});