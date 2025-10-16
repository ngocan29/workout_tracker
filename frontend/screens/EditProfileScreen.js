import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Avatar, Card, Button, Title } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../app-example/constants/Colors';
import { AuthService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function EditProfileScreen({ setCurrentScreen }) {
  const router = useRouter();
  const { userData } = useLocalSearchParams();
  
  // Parse userData và kiểm tra loại tài khoản
  const parsedUserData = userData && typeof userData === 'string' ? JSON.parse(userData) : {};
  const isBusiness = parsedUserData.loai_tai_khoan === 'business';
  
  // Mock navigation object để tương thích với existing code
  const navigation = {
    goBack: () => setCurrentScreen ? setCurrentScreen('profile') : null,
    navigate: (screen) => {
      if (screen === 'Profile' && setCurrentScreen) {
        setCurrentScreen('profile');
      }
    }
  };
  // Business form state
  const [ten, setTen] = useState(parsedUserData.ten || '');
  const [sodienthoai, setSodienthoai] = useState(parsedUserData.sodienthoai || '');
  const [diachi, setDiachi] = useState(parsedUserData.diachi || '');
  const [email] = useState(parsedUserData.email || '');
  const [nguoidaidien, setNguoidaidien] = useState(parsedUserData.nguoidaidien || '');
  
  // Personal form state (existing)
  const [form, setForm] = useState({
    fullName: 'Nguyễn Minh Tuấn',
    email: 'minhtuan.fitness@gmail.com',
    phone: '0901234567',
    address: 'Quận 1, TP. Hồ Chí Minh',
    gender: 'male',
    height: '175',
    weight: '68.5',
    waist: '78',
    chest: '95',
    thigh: '58',
    arm: '32',
  });
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBodyMeasurementModal, setShowBodyMeasurementModal] = useState(false);
  const [avatarUri, setAvatarUri] = useState(
    'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20young%20Vietnamese%20fitness%20enthusiast%20with%20friendly%20smile%20and%20athletic%20appearance%20in%20modern%20gym%20setting%20with%20natural%20lighting%20and%20professional%20studio%20quality&width=240&height=240&seq=profileedit1&orientation=squarish'
  );

  const [scaleValue] = useState(new Animated.Value(1)); // Animation cho success

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

  const handleInputChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateNutrition = () => {
    if (!form.height || !form.weight) {
      Alert.alert('Lỗi', 'Vui lòng nhập chiều cao và cân nặng');
      return;
    }
    Alert.alert('Thành công', 'Đã cập nhật thông tin thể chất');
  };

  // Business save function
  const handleBusinessSave = async () => {
    if (!ten || !sodienthoai || !diachi) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (isBusiness && !nguoidaidien) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên người đại diện');
      return;
    }

    try {
      setLoading(true);
      
      const updatedData = {
        ten,
        sodienthoai,
        diachi,
        ...(isBusiness ? { nguoidaidien } : {})
      };
      
      const result = await AuthService.updateProfile(updatedData);
      
      if (result) {
        // Trigger success animation
        Animated.sequence([
          Animated.timing(scaleValue, { toValue: 1.05, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleValue, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Trigger success animation
      Animated.sequence([
        Animated.timing(scaleValue, { toValue: 1.05, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleValue, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setShowSuccessModal(true);
      Alert.alert('Thành công', 'Thông tin đã được cập nhật thành công!');
    } catch (_error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Xác nhận hủy',
      'Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          onPress: () => {
            // Navigate back or to specific screen
            navigation.navigate('Profile'); // Hoặc hardcode URL nếu cần
          },
        },
      ]
    );
  };

  // Render Business Form (simple)
  const renderBusinessForm = () => (
    <ScrollView style={[businessStyles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white }]}>
      <Text style={[businessStyles.title, { color: isDarkMode ? Colors.darkText : Colors.primary }]}>
        {isBusiness ? 'Cập nhật thông tin doanh nghiệp' : 'Cập nhật thông tin cá nhân'}
      </Text>
      
      <TextInput
        style={[businessStyles.input, { 
          backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
          borderColor: isDarkMode ? Colors.darkSecondary : Colors.gray,
          color: isDarkMode ? Colors.darkText : Colors.black
        }]}
        placeholder={isBusiness ? "Tên công ty" : "Họ tên"}
        placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
        value={ten}
        onChangeText={setTen}
      />
      
      {isBusiness && (
        <TextInput
          style={[businessStyles.input, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkSecondary : Colors.gray,
            color: isDarkMode ? Colors.darkText : Colors.black
          }]}
          placeholder="Người đại diện"
          placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
          value={nguoidaidien}
          onChangeText={setNguoidaidien}
        />
      )}
      
      <TextInput
        style={[businessStyles.input, { 
          backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
          borderColor: isDarkMode ? Colors.darkSecondary : Colors.gray,
          color: isDarkMode ? Colors.darkText : Colors.black
        }]}
        placeholder="Số điện thoại"
        placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
        value={sodienthoai}
        onChangeText={setSodienthoai}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={[businessStyles.input, { 
          backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
          borderColor: isDarkMode ? Colors.darkSecondary : Colors.gray,
          color: isDarkMode ? Colors.darkText : Colors.black
        }]}
        placeholder="Địa chỉ"
        placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
        value={diachi}
        onChangeText={setDiachi}
        multiline
      />
      
      <TextInput
        style={[businessStyles.input, businessStyles.disabledInput, { 
          backgroundColor: isDarkMode ? Colors.darkBackground : '#f5f5f5',
          borderColor: isDarkMode ? Colors.darkSecondary : Colors.gray,
          color: isDarkMode ? Colors.darkSecondary : '#999'
        }]}
        placeholder="Email"
        placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
        value={email}
        editable={false}
      />
      
      <View style={businessStyles.actions}>
        <Button 
          mode="outlined"
          style={[businessStyles.button, businessStyles.cancelButton]}
          onPress={() => {
            if (router && typeof router.back === 'function') {
              router.back();
            } else {
              navigation.goBack();
            }
          }}
          icon="close"
        >
          Hủy
        </Button>
        <Button 
          mode="contained"
          style={[businessStyles.button, businessStyles.saveButton]}
          onPress={handleBusinessSave}
          loading={loading}
          disabled={loading}
          icon="content-save"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </View>
      
      {/* Success Modal cho Business */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={businessStyles.modalOverlay}>
          <View style={[businessStyles.modalContent, { backgroundColor: isDarkMode ? Colors.darkSurface : 'white' }]}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <View style={[businessStyles.successIcon, { backgroundColor: isDarkMode ? Colors.darkBackground : '#dcfce7' }]}>
                <Ionicons name="checkmark-circle" size={60} color={Colors.darkGreen} />
              </View>
            </Animated.View>
            <Title style={[businessStyles.modalTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>Cập nhật thành công!</Title>
            <Text style={[businessStyles.modalText, { color: isDarkMode ? Colors.darkSecondary : '#6b7280' }]}>Thông tin doanh nghiệp của bạn đã được lưu thành công.</Text>
            <View style={businessStyles.modalButtons}>
              <Button
                mode="outlined"
                style={[businessStyles.modalButton, businessStyles.continueButton]}
                onPress={() => setShowSuccessModal(false)}
              >
                Tiếp tục chỉnh sửa
              </Button>
              <Button
                mode="contained"
                style={[businessStyles.modalButton, businessStyles.modalBackButton]}
                onPress={() => {
                  setShowSuccessModal(false);
                  if (router && typeof router.back === 'function') {
                    router.back();
                  } else {
                    navigation.goBack();
                  }
                }}
              >
                Quay về
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  // Render business form cho business users
  if (isBusiness) {
    return renderBusinessForm();
  }

  // Render personal form cho personal/employee users
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb' }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
        borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? Colors.darkText : "#6b7280"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>Thông Tin Cá Nhân</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={120}
              source={{ uri: avatarUri }}
              style={[styles.avatar, { borderWidth: 4, borderColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }]}
            />
            <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
              <Ionicons name="camera-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changeAvatarText}>
              <Ionicons name="camera-outline" size={16} color="#3b82f6" /> Thay đổi ảnh đại diện
            </Text>
          </TouchableOpacity>
          <Card style={styles.avatarCard}>
            <Card.Content />
          </Card>
        </View>

        {/* Thông tin cơ bản */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { borderBottomColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb' }]}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : '#1f2937' }]}>Thông Tin Cơ Bản</Text>
          </View>
          <Card style={[styles.formCard, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <View style={styles.inputGroup}>
                <View style={[styles.inputRow, { backgroundColor: isDarkMode ? Colors.darkBackground : 'white' }]}>
                  <TextInput
                    style={[styles.input, styles.fullInput, { color: isDarkMode ? Colors.darkText : Colors.black }]}
                    placeholder="Nhập họ và tên"
                    placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                    value={form.fullName}
                    onChangeText={value => handleInputChange('fullName', value)}
                  />
                  <Ionicons name="person-outline" size={20} color={isDarkMode ? Colors.darkSecondary : "#9ca3af"} style={styles.inputIcon} />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.fullInput, { backgroundColor: '#f5f5f5', color: '#999' }]}
                    placeholder="Nhập địa chỉ email"
                    value={form.email}
                    editable={false}
                  />
                  <Ionicons name="mail-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.fullInput]}
                    placeholder="Nhập số điện thoại"
                    value={form.phone}
                    keyboardType="phone-pad"
                    onChangeText={value => handleInputChange('phone', value)}
                  />
                  <Ionicons name="call-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.fullInput]}
                    placeholder="Nhập địa chỉ"
                    value={form.address}
                    onChangeText={value => handleInputChange('address', value)}
                  />
                  <Ionicons name="location-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Thông tin thể chất */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông Tin Thể Chất</Text>
            <Button
              mode={form.height && form.weight ? "outlined" : "contained"}
              onPress={handleUpdateNutrition}
              style={styles.sectionButton}
              labelStyle={{ fontSize: 12 }}
              icon={form.height && form.weight ? "refresh" : "plus"}
            >
              {form.height && form.weight ? "Cập nhật" : "Thêm"}
            </Button>
          </View>
          <Card style={styles.formCard}>
            <Card.Content>
              <View style={styles.inputGroup}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="175"
                    value={form.height}
                    keyboardType="numeric"
                    onChangeText={value => handleInputChange('height', value)}
                  />
                  <Text style={styles.suffix}>cm</Text>
                  <Ionicons name="body-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="68.5"
                    value={form.weight}
                    keyboardType="numeric"
                    onChangeText={value => handleInputChange('weight', value)}
                  />
                  <Text style={styles.suffix}>kg</Text>
                  <Ionicons name="scale-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Số đo cơ thể */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Số Đo Cơ Thể</Text>
            <Button
              mode={form.waist || form.chest || form.thigh || form.arm ? "outlined" : "contained"}
              onPress={() => setShowBodyMeasurementModal(true)}
              style={styles.sectionButton}
              labelStyle={{ fontSize: 12 }}
              icon={form.waist || form.chest || form.thigh || form.arm ? "refresh" : "plus"}
            >
              {form.waist || form.chest || form.thigh || form.arm ? "Cập nhật" : "Thêm"}
            </Button>
          </View>
          <Card style={styles.formCard}>
            <Card.Content>
              <View style={styles.inputGroup}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="78"
                    value={form.waist}
                    keyboardType="numeric"
                    onChangeText={value => handleInputChange('waist', value)}
                  />
                  <Text style={styles.suffix}>cm</Text>
                  <Text style={styles.label}>Vòng Eo</Text>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="95"
                    value={form.chest}
                    keyboardType="numeric"
                    onChangeText={value => handleInputChange('chest', value)}
                  />
                  <Text style={styles.suffix}>cm</Text>
                  <Text style={styles.label}>Vòng Ngực</Text>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="58"
                    value={form.thigh}
                    keyboardType="numeric"
                    onChangeText={value => handleInputChange('thigh', value)}
                  />
                  <Text style={styles.suffix}>cm</Text>
                  <Text style={styles.label}>Vòng Đùi</Text>
                </View>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="32"
                    value={form.arm}
                    keyboardType="numeric"
                    onChangeText={value => handleInputChange('arm', value)}
                  />
                  <Text style={styles.suffix}>cm</Text>
                  <Text style={styles.label}>Vòng Tay</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomBar, { 
        backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
        borderTopColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
      }]}>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            icon="close"
            loading={loading}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            mode="contained"
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            loading={loading}
            icon="content-save"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? Colors.darkSurface : 'white' }]}>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <View style={[styles.successIcon, { backgroundColor: isDarkMode ? Colors.darkBackground : '#dcfce7' }]}>
                <Ionicons name="checkmark-circle" size={60} color={Colors.darkGreen} />
              </View>
            </Animated.View>
            <Title style={[styles.modalTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>Cập nhật thành công!</Title>
            <Text style={[styles.modalText, { color: isDarkMode ? Colors.darkSecondary : '#6b7280' }]}>Thông tin cá nhân của bạn đã được lưu thành công.</Text>
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                style={[styles.modalButton, styles.continueButton]}
                onPress={() => setShowSuccessModal(false)}
              >
                Tiếp tục chỉnh sửa
              </Button>
              <Button
                mode="contained"
                style={[styles.modalButton, styles.modalBackButton]}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('Profile'); // Hoặc hardcode navigation
                }}
              >
                Quay về
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Body Measurement Modal */}
      <Modal
        visible={showBodyMeasurementModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBodyMeasurementModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? Colors.darkSurface : 'white', height: '70%' }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowBodyMeasurementModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? Colors.darkText : Colors.black} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
                Số Đo Cơ Thể
              </Text>
              <TouchableOpacity onPress={() => setShowBodyMeasurementModal(false)}>
                <Text style={[styles.saveButton, { color: Colors.darkGreen }]}>Lưu</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, padding: 16 }}>
              <View style={[styles.inputGroup, { marginBottom: 20 }]}>
                <Text style={[styles.sectionTitle, { 
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  marginBottom: 12
                }]}>Thêm Số Đo Mới</Text>
                
                <TextInput
                  style={[styles.input, styles.fullInput, { 
                    backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                    color: isDarkMode ? Colors.darkText : Colors.black,
                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                  }]}
                  placeholder="Tên bộ phận (VD: Vòng ngực)"
                  placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                />

                <TextInput
                  style={[styles.input, styles.fullInput, { 
                    backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                    color: isDarkMode ? Colors.darkText : Colors.black,
                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                  }]}
                  placeholder="Số đo (cm)"
                  placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                  keyboardType="numeric"
                />

                <Button
                  mode="contained"
                  style={[styles.button, { backgroundColor: Colors.darkGreen, marginTop: 8 }]}
                  icon="plus"
                >
                  Thêm Bộ Phận
                </Button>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.sectionTitle, { 
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  marginBottom: 12
                }]}>Danh Sách Số Đo</Text>
                
                <View style={[styles.measurementItem, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb',
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb',
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8
                }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={[styles.measurementName, { 
                        color: isDarkMode ? Colors.darkText : Colors.black,
                        fontSize: 14,
                        fontWeight: '500'
                      }]}>Vòng Ngực</Text>
                      <Text style={[styles.measurementValue, { 
                        color: isDarkMode ? Colors.darkSecondary : Colors.gray,
                        fontSize: 12
                      }]}>95 cm</Text>
                    </View>
                    <TouchableOpacity style={{ padding: 4 }}>
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 1,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  content: { flex: 1 },
  avatarSection: { alignItems: 'center', padding: 16 },
  avatarContainer: { position: 'relative' },
  avatar: { backgroundColor: '#e5e7eb' },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    elevation: 3,
  },
  changeAvatarText: { color: '#3b82f6', fontWeight: '500', marginTop: 8 },
  avatarCard: { backgroundColor: 'transparent', elevation: 0 },
  section: { marginHorizontal: 16, marginVertical: 8 },
  sectionHeader: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8, 
    borderBottomWidth: 2, 
    borderBottomColor: '#e5e7eb' 
  },
  sectionButton: {
    minWidth: 80,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  measurementItem: {
    // Styles already defined inline
  },
  measurementName: {
    // Styles already defined inline
  },
  measurementValue: {
    // Styles already defined inline
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  formCard: { borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', elevation: 1 },
  inputGroup: { gap: 16 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  fullInput: { borderRadius: 12 },
  halfInput: { flex: 1 },
  inputIcon: { marginLeft: 8 },
  suffix: { marginLeft: 8, color: '#6b7280', fontWeight: '500' },
  label: { position: 'absolute', top: -20, left: 12, fontSize: 12, color: '#374151' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 5,
    padding: 16,
  },
  buttonContainer: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, justifyContent: 'center', height: 48, borderRadius: 12 },
  cancelButton: { borderColor: '#d1d5db' },
  saveButton: { backgroundColor: '#3b82f6' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: width * 0.85,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  modalText: { textAlign: 'center', color: '#6b7280', marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: { flex: 1, justifyContent: 'center', height: 44, borderRadius: 12 },
  continueButton: { borderColor: '#d1d5db' },
  modalBackButton: { backgroundColor: '#3b82f6' },
});

// Business form styles
const businessStyles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 12 },
  disabledInput: { backgroundColor: '#f5f5f5', color: '#999' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 20 },
  button: { flex: 1, justifyContent: 'center', height: 48, borderRadius: 12 },
  cancelButton: { borderColor: '#d1d5db' },
  saveButton: { backgroundColor: '#3b82f6' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: width * 0.85,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  modalText: { textAlign: 'center', color: '#6b7280', marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: { flex: 1, justifyContent: 'center', height: 44, borderRadius: 12 },
  continueButton: { borderColor: '#d1d5db' },
  modalBackButton: { backgroundColor: '#3b82f6' },
});