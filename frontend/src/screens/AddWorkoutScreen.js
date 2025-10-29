import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Platform} from 'react-native';
import { ArrowLeft, Plus, Trash2 } from 'react-native-feather';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { WorkoutService } from '../services/api';

export default function AddWorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  // Check if this is edit mode
  const isEditMode = params.editMode === 'true';
  const editWorkoutData = params.workoutData ? JSON.parse(params.workoutData) : null;

  // Form state
  const [formData, setFormData] = useState(() => {
    if (isEditMode && editWorkoutData) {
      return {
        ten: editWorkoutData.name || '',
        anhminhhoa: editWorkoutData.image || '',
        mota: editWorkoutData.description || '',
        thoigiangoc: parseInt(editWorkoutData.duration) || 30,
        hengiomoinghay: '',
        calotieuthukhoiluong: editWorkoutData.calories || 0,
        cacbuoc: editWorkoutData.steps || [''],
        loiich: editWorkoutData.benefits || [''],
        danhmuc: editWorkoutData.category || 'cardio',
      };
    }
    return {
      ten: '',
      anhminhhoa: '',
      mota: '',
      thoigiangoc: 30, // phút
      hengiomoinghay: '',
      calotieuthukhoiluong: 0,
      cacbuoc: [''],
      loiich: [''],
      danhmuc: 'cardio',
    };
  });

  // Categories options
  const categories = [
    { label: 'Cardio', value: 'cardio' },
    { label: 'Tạ', value: 'ta' },
    { label: 'Yoga', value: 'yoga' },
    { label: 'HIIT', value: 'hiit' },
    { label: 'Thể dục', value: 'theduc' },
    { label: 'Khác', value: 'khac' },
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      cacbuoc: [...prev.cacbuoc, '']
    }));
  };

  const removeStep = (index) => {
    if (formData.cacbuoc.length > 1) {
      setFormData(prev => ({
        ...prev,
        cacbuoc: prev.cacbuoc.filter((_, i) => i !== index)
      }));
    }
  };

  const updateStep = (index, value) => {
    setFormData(prev => ({
      ...prev,
      cacbuoc: prev.cacbuoc.map((step, i) => i === index ? value : step)
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      loiich: [...prev.loiich, '']
    }));
  };

  const removeBenefit = (index) => {
    if (formData.loiich.length > 1) {
      setFormData(prev => ({
        ...prev,
        loiich: prev.loiich.filter((_, i) => i !== index)
      }));
    }
  };

  const updateBenefit = (index, value) => {
    setFormData(prev => ({
      ...prev,
      loiich: prev.loiich.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  // chinh sua thong bao alert
  const showAlert = (title, message, onPressOK) => {
    if (Platform.OS === 'web') {
      // Hiển thị alert web
      window.alert(`${title}\n${message}`);
      // Chỉ gọi callback nếu thực sự là một hàm
      if (typeof onPressOK === 'function') {
        onPressOK();
      }
    } else {
      // Native Alert (iOS/Android)
      Alert.alert(title, message, [
        {
          text: 'OK',
          onPress: () => {
            if (typeof onPressOK === 'function') {
              onPressOK();
            }
          },
        },
      ]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validation
      if (!formData.ten.trim()) {
        showAlert('Lỗi', 'Vui lòng nhập tên bài tập');
        return;
      }

      // Get current user info
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;

      if (!user) {
        showAlert('Lỗi', 'Không tìm thấy thông tin người dùng');
        return;
      }

      // Prepare workout data
      const workoutData = {
        ten: formData.ten.trim() || ' ',
        anhminhhoa: formData.anhminhhoa.trim() || ' ',
        mota: formData.mota.trim() || ' ',
        thoigiangoc: formData.thoigiangoc || 30,
        hengiomoinghay: formData.hengiomoinghay.trim() || ' ',
        calotieuthukhoiluong: formData.calotieuthukhoiluong || 0,
        cacbuoc: formData.cacbuoc.filter(step => step.trim()).length > 0 
          ? formData.cacbuoc.filter(step => step.trim()) 
          : [' '],
        loiich: formData.loiich.filter(benefit => benefit.trim()).length > 0 
          ? formData.loiich.filter(benefit => benefit.trim()) 
          : [' '],
        danhmuc: formData.danhmuc,
        trangthai: 'chuahoanthanh',
        thongke: 0,
        ngaytao: new Date().toISOString(),
      };

      // Set user ID based on account type
      if (user.loai_tai_khoan === 'business') {
        if (user.additional_info?.vai_tro === 'nhanvien') {
          workoutData.nhanvienUserID = user._id;
        } else {
          workoutData.userID = user._id;
        }
      } else if (user.loai_tai_khoan === 'personal') {
        if (user.additional_info?.vai_tro === 'khachhang') {
          workoutData.khachhangUserID = user._id;
        } else {
          workoutData.userID = user._id;
        }
      } else {
        workoutData.userID = user._id;
      }

      console.log('Saving workout data:', workoutData);

      // Call API to save or update workout
      let response;
      if (isEditMode && editWorkoutData) {
        // Update existing workout
        response = await WorkoutService.updateWorkout(editWorkoutData.id, workoutData);
        console.log('Workout updated successfully:', response);
      } else {
        // Create new workout
        response = await WorkoutService.createWorkout(workoutData);
        console.log('Workout created successfully:', response);
      }

      showAlert(    // su dung showalert vi alert chi hien thi mobile
        'Thành công',
        isEditMode ? 'Bài tập đã được cập nhật thành công!' : 'Bài tập đã được tạo thành công!',
        () => { router.back();
        }
      );

    } catch (error) {
      console.error('Error saving workout:', error);
      showAlert('Lỗi', 'Có lỗi xảy ra khi lưu bài tập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft stroke={Colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Chỉnh Sửa Bài Tập' : 'Thêm Bài Tập Mới'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      ><View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông Tin Cơ Bản</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tên bài tập *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.ten}
                  onChangeText={(value) => updateFormData('ten', value)}
                  placeholder="Nhập tên bài tập..."
                  placeholderTextColor={Colors.gray}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ảnh minh họa (URL)</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.anhminhhoa}
                  onChangeText={(value) => updateFormData('anhminhhoa', value)}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor={Colors.gray}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={formData.mota}
                  onChangeText={(value) => updateFormData('mota', value)}
                  placeholder="Mô tả về bài tập..."
                  placeholderTextColor={Colors.gray}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Thời gian (phút)</Text>
                  <TextInput
                style={styles.textInput}
                value={formData.thoigiangoc.toString()}
                onChangeText={(value) => updateFormData('thoigiangoc', parseInt(value) || 0)}
                placeholder="30"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Calo tiêu thụ</Text>
                  <TextInput
                style={styles.textInput}
                value={formData.calotieuthukhoiluong.toString()}
                onChangeText={(value) => updateFormData('calotieuthukhoiluong', parseInt(value) || 0)}
                placeholder="250"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Hẹn giờ mỗi ngày</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.hengiomoinghay}
                  onChangeText={(value) => updateFormData('hengiomoinghay', value)}
                  placeholder="VD: 07:00, 18:00"
                  placeholderTextColor={Colors.gray}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Danh mục</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                >
                  <Text style={styles.pickerButtonText}>
                {categories.find(cat => cat.value === formData.danhmuc)?.label || 'Chọn danh mục'}
                  </Text>
                </TouchableOpacity>
                
                {showCategoryPicker && (
                  <View style={styles.categoryDropdown}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={styles.categoryOption}
                    onPress={() => {
                      updateFormData('danhmuc', category.value);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      formData.danhmuc === category.value && styles.categoryOptionSelected
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                  </View>
                )}
              </View>
            </View>

            {/* Steps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Các Bước Thực Hiện</Text>
            <TouchableOpacity style={styles.addButton} onPress={addStep}>
              <Plus stroke={Colors.white} width={16} height={16} />
            </TouchableOpacity>
          </View>
          
          {formData.cacbuoc.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.stepInput]}
                value={step}
                onChangeText={(value) => updateStep(index, value)}
                placeholder={`Bước ${index + 1}...`}
                placeholderTextColor={Colors.gray}
                multiline
              />
              {formData.cacbuoc.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeStep(index)}
                >
                  <Trash2 stroke={Colors.accent} width={16} height={16} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lợi Ích</Text>
            <TouchableOpacity style={styles.addButton} onPress={addBenefit}>
              <Plus stroke={Colors.white} width={16} height={16} />
            </TouchableOpacity>
          </View>
          
          {formData.loiich.map((benefit, index) => (
            <View key={index} style={styles.benefitContainer}>
              <Text style={styles.bulletPoint}>✓</Text>
              <TextInput
                style={[styles.textInput, styles.benefitInput]}
                value={benefit}
                onChangeText={(value) => updateBenefit(index, value)}
                placeholder={`Lợi ích ${index + 1}...`}
                placeholderTextColor={Colors.gray}
                multiline
              />
              {formData.loiich.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeBenefit(index)}
                >
                  <Trash2 stroke={Colors.accent} width={16} height={16} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Padding bottom for fixed button */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Fixed Save Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Đang lưu...' : (isEditMode ? 'Cập Nhật Bài Tập' : 'Lưu Bài Tập')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.gray + '30',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.gray + '30',
  },
  pickerButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  categoryDropdown: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray + '30',
    marginTop: 4,
    overflow: 'hidden',
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray + '10',
  },
  categoryOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  categoryOptionSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 8,
  },
  stepNumberText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },
  stepInput: {
    flex: 1,
    minHeight: 40,
  },
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 8,
    marginTop: 10,
    fontWeight: 'bold',
  },
  benefitInput: {
    flex: 1,
    minHeight: 40,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
    marginTop: 4,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray + '20',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  saveButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
  },
});