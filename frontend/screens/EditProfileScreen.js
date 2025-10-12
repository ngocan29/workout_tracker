import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Camera } from 'react-native-feather';
import Colors from '../app-example/constants/Colors';
import { Picker } from '@react-native-picker/picker';

export default function EditProfileScreen({ setCurrentScreen, userProfile, setUserProfile }) {
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('main')}>
          <ArrowLeft stroke={Colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh Sửa Hồ Sơ</Text>
        <TouchableOpacity style={styles.saveButton} onPress={() => setCurrentScreen('main')}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.avatarSection}>
        <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.cameraButton}>
          <Camera stroke={Colors.white} width={20} height={20} />
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Nhấn vào camera để thay đổi ảnh đại diện</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={userProfile.name}
          onChangeText={(text) => setUserProfile({ ...userProfile, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userProfile.email}
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={userProfile.phone}
        />
        <TextInput
          style={styles.input}
          placeholder="Ngày sinh"
          value={userProfile.birthday}
        />
        <Picker
          style={styles.picker}
          selectedValue={userProfile.gender}
          onValueChange={(value) => setUserProfile({ ...userProfile, gender: value })}
        >
          <Picker.Item label="Nam" value="male" />
          <Picker.Item label="Nữ" value="female" />
          <Picker.Item label="Khác" value="other" />
        </Picker>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Chiều cao (cm)"
            value={userProfile.height.toString()}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Cân nặng (kg)"
            value={userProfile.currentWeight.toString()}
            keyboardType="numeric"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Cân nặng mục tiêu (kg)"
          value={userProfile.targetWeight.toString()}
          keyboardType="numeric"
        />
        <Picker
          style={styles.picker}
          selectedValue={userProfile.fitnessLevel}
          onValueChange={(value) => setUserProfile({ ...userProfile, fitnessLevel: value })}
        >
          <Picker.Item label="Người mới bắt đầu" value="beginner" />
          <Picker.Item label="Trung cấp" value="intermediate" />
          <Picker.Item label="Nâng cao" value="advanced" />
          <Picker.Item label="Chuyên nghiệp" value="expert" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Địa điểm"
          value={userProfile.location}
        />
        <TextInput
          style={styles.input}
          placeholder="Nghề nghiệp"
          value={userProfile.occupation}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Giới thiệu bản thân"
          value={userProfile.bio}
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setCurrentScreen('main')}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={[styles.buttonText, { color: Colors.white }]}>Lưu Thay Đổi</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: Colors.white,
  },
  avatarSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 90,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 8,
  },
  avatarHint: {
    fontSize: 14,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: Colors.text,
  },
});