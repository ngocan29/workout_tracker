import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../app-example/constants/Colors';

export default function AccountTypeSelection() {
  const router = useRouter();

  const handleSelectType = (type) => {
    router.push({ pathname: '/RegisterScreen', params: { accountType: type } });
  };

  const handleBack = () => {
    router.back(); // Quay lại màn hình LoginScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn loại tài khoản</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Tài khoản cá nhân"
          onPress={() => handleSelectType('personal')}
          color={Colors.primary}
        />
        <View style={{ height: 16 }} />
        <Button
          title="Tài khoản doanh nghiệp"
          onPress={() => handleSelectType('business')}
          color={Colors.primary}
        />
      </View>
      <TouchableOpacity onPress={handleBack} style={styles.linkContainer}>
        <Text style={styles.link}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: Colors.white },
  buttonContainer: { marginVertical: 10 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: Colors.black, marginBottom: 20 },
  linkContainer: { marginTop: 20, alignItems: 'center' },
  link: { color: Colors.primary, fontSize: 16 },
});