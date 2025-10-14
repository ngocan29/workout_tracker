import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../app-example/constants/Colors';

const AuthService = {
  signup: async (data) => { return true; },
};

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
  const router = useRouter();

  const handleSignup = async () => {
    let data = { email, password, accountType };
    if (accountType === 'business') {
      data = { ...data, companyName, address, taxCode, representative, phone };
    } else {
      data = { ...data, name };
    }
    const success = await AuthService.signup(data);
    if (success) {
      router.replace('/app-example/app/(tabs)/'); // Điều hướng đến tabs sau khi đăng ký thành công
    } else {
      alert('Đăng ký thất bại');
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
        <Button title="Đăng ký" onPress={handleSignup} color={Colors.primary} />
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