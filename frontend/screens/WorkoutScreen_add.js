import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Title } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../app-example/constants/Colors';
import Navbar from '../app-example/components/ui/Navbar';

export default function AddWorkoutScreen({ navigation, isDarkMode, setDarkMode }) {
  const [ten, setTen] = useState('');
  const [mota, setMota] = useState('');
  const [calo, setCalo] = useState('');
  const [thoigiangoc, setThoigiangoc] = useState('');
  const [trangthai, setTrangthai] = useState('chuahoanthanh');

  const handleAddWorkout = async () => {
    if (!ten || !mota || !thoigiangoc) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    const newWorkout = {
      ten,
      mota,
      calo: Number(calo),
      thoigiangoc: Number(thoigiangoc),
      cacbuoc: [],
      loiich: [],
      trangthai,
      ngaytao: new Date(),
      ngaycapnhat: new Date()
    };

    try {
      const response = await fetch('http://192.168.1.19:5000/baitap', { // đổi IP này thành IP máy bạn
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkout)
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Thêm bài tập mới thành công!');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.error || 'Không thể thêm bài tập.');
      }
    } catch (error) {
      Alert.alert('Lỗi kết nối', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      <ScrollView contentContainerStyle={styles.content}>
        <Title style={[styles.title, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
          🏋️‍♀️ Thêm Bài Tập Mới
        </Title>

        <TextInput
          style={styles.input}
          placeholder="Tên bài tập"
          value={ten}
          onChangeText={setTen}
        />
        <TextInput
          style={styles.input}
          placeholder="Mô tả"
          value={mota}
          onChangeText={setMota}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Calo (kcal)"
          value={calo}
          onChangeText={setCalo}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Thời gian gốc (phút)"
          value={thoigiangoc}
          onChangeText={setThoigiangoc}
          keyboardType="numeric"
        />

        <Button
          mode="contained"
          onPress={handleAddWorkout}
          style={styles.addButton}
        >
          <Ionicons name="add-circle-outline" size={20} color="white" />  Thêm Bài Tập
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white'
  },
  addButton: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 8
  }
});
