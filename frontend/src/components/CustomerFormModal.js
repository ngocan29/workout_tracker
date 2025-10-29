import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import { 
  TextInput, 
  Card, 
  SegmentedButtons,
  Button,
  Menu,
  Divider
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { getEmployeesByBranch } from '../services/employeeApi';
import { createCustomer, updateCustomer } from '../services/customerApi';

export default function CustomerFormModal({ 
  visible, 
  customer = null, // null for new customer, object for editing
  isDarkMode, 
  onClose, 
  onSave 
}) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    gender: 'male',
    password: '', // Thêm field mật khẩu
    dateOfBirth: '',
    height: '',
    weight: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalNotes: '',
    fitnessGoal: '',
    bodyMeasurements: [],
    assignedEmployeeId: '' // Thêm field để lưu ID nhân viên được chọn
  });

  const [errors, setErrors] = useState({});
  const [showBodyMeasurementModal, setShowBodyMeasurementModal] = useState(false);
  const [hasNutritionData, setHasNutritionData] = useState(false);
  const [hasBodyMeasurements, setHasBodyMeasurements] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' }
  ];

  const fitnessGoals = [
    'Giảm cân',
    'Tăng cân',
    'Tăng cơ',
    'Tăng sức mạnh',
    'Tăng sức bền',
    'Cải thiện sức khỏe tổng quát',
    'Phục hồi chấn thương',
    'Thi đấu thể thao'
  ];

  // Load user data từ AsyncStorage
  useEffect(() => {
    loadUserData();
  }, []);

  // Load employees khi có userData và user là business
  useEffect(() => {
    // vai_tro = undefined có nghĩa là Business User
    const isBusiness = userData?.additional_info?.vai_tro === undefined || 
                       userData?.additional_info?.vai_tro == null ||
                       userData?.additional_info?.isBusiness;
    
    if (isBusiness && userData?.additional_info?.chinhanhID) {
      const loadEmployees = async () => {
        try {
          const chinhanhID = userData?.additional_info?.chinhanhID;
          if (!chinhanhID) return;

          const result = await getEmployeesByBranch(chinhanhID);
          if (result.success) {
            setEmployees(result.data);
          } else {
            console.error('Error loading employees:', result.error);
          }
        } catch (error) {
          console.error('Error in loadEmployees:', error);
        }
      };
      
      loadEmployees();
    }
  }, [userData]);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Load customer data when editing
  useEffect(() => {
    if (customer) {
      console.log('Loading customer data for editing:', customer);
      
      // Map dữ liệu từ customer object với nhiều format khác nhau
      setForm({
        fullName: customer.fullName || customer.ten || '',
        email: customer.email || '',
        phone: customer.phone || customer.sodienthoai || '',
        address: customer.address || customer.diachi || '',
        gender: customer.gender || customer.gioitinh || 'male',
        password: '', // Không hiển thị password cũ khi edit
        dateOfBirth: customer.dateOfBirth || customer.ngaysinh || '',
        height: customer.height || customer.chieucao || '',
        weight: customer.weight || customer.cannang || '',
        emergencyContact: customer.emergencyContact || customer.lienhe_khan_cap || '',
        emergencyPhone: customer.emergencyPhone || customer.sdt_khan_cap || '',
        medicalNotes: customer.medicalNotes || customer.ghi_chu_y_te || '',
        fitnessGoal: customer.fitnessGoal || customer.muc_tieu_tap_luyen || '',
        bodyMeasurements: customer.bodyMeasurements || [],
        assignedEmployeeId: customer.assignedEmployeeId || customer.additional_info?.nhanvienUserID || ''
      });
      
      setHasNutritionData(!!customer.height || !!customer.weight || !!customer.chieucao || !!customer.cannang);
      setHasBodyMeasurements(customer.bodyMeasurements && customer.bodyMeasurements.length > 0);
    } else {
      console.log('Creating new customer form');
      // Reset form for new customer
      setForm({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        gender: 'male',
        password: '', // Reset password field
        dateOfBirth: '',
        height: '',
        weight: '',
        emergencyContact: '',
        emergencyPhone: '',
        medicalNotes: '',
        fitnessGoal: '',
        bodyMeasurements: [],
        assignedEmployeeId: ''
      });
      setHasNutritionData(false);
      setHasBodyMeasurements(false);
    }
    setErrors({});
  }, [customer]);

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    // Validate password - required for new customer
    if (!customer && !form.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu cho khách hàng mới';
    } else if (form.password && form.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Validate numeric fields
    if (form.height && (isNaN(form.height) || form.height <= 0)) {
      newErrors.height = 'Chiều cao phải là số dương';
    }

    if (form.weight && (isNaN(form.weight) || form.weight <= 0)) {
      newErrors.weight = 'Cân nặng phải là số dương';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Lỗi', 'Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    setLoading(true);
    
    try {
      // Debug logging
      console.log('handleSave - customer:', customer);
      console.log('handleSave - customer._id:', customer?._id);
      console.log('handleSave - customer.id:', customer?.id);
      console.log('handleSave - customer.loai_tai_khoan:', customer?.loai_tai_khoan);
      
      // Chỉ gửi thông tin cơ bản để tạo/cập nhật
      const basicCustomerData = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
        assignedEmployeeId: form.assignedEmployeeId,
        chinhanhID: userData?.additional_info?.chinhanhID || userData?.chinhanhID
      };

      // Đối với cập nhật khách hàng, cần thêm loai_tai_khoan để tránh validation error
      if (customer) {
        basicCustomerData.loai_tai_khoan = customer.loai_tai_khoan || 'personal';
      }

      // Chỉ thêm password khi tạo mới hoặc khi có thay đổi password
      if (!customer) {
        // Tạo mới - password là bắt buộc
        if (!form.password.trim()) {
          Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu cho khách hàng mới');
          setLoading(false);
          return;
        }
        basicCustomerData.password = form.password;
      } else if (form.password && form.password.trim()) {
        // Cập nhật - chỉ thêm password nếu có nhập mật khẩu mới
        basicCustomerData.password = form.password;
      }

      let result;
      // Kiểm tra customer ID với nhiều format khác nhau
      const customerId = customer?._id || customer?.id;
      
      if (customer && customerId) {
        // Cập nhật khách hàng hiện có
        console.log('Updating customer with ID:', customerId);
        result = await updateCustomer(customerId, basicCustomerData);
      } else {
        // Tạo khách hàng mới
        console.log('Creating new customer');
        result = await createCustomer(basicCustomerData);
      }

      if (result.success) {
        Alert.alert(
          'Thành công', 
          result.message || (customer ? 'Cập nhật khách hàng thành công!' : 'Thêm khách hàng thành công!'),
          [{
            text: 'OK',
            onPress: () => {
              onSave(result.customer); // Trả về data từ API
              onClose();
            }
          }]
        );
      } else {
        throw new Error(result.error || 'Có lỗi xảy ra');
      }
      
    } catch (error) {
      console.error('Error saving customer:', error);
      Alert.alert(
        'Lỗi',
        error.message || 'Có lỗi xảy ra khi lưu thông tin khách hàng',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNutrition = () => {
    setHasNutritionData(true);
    Alert.alert(
      'Cập nhật dinh dưỡng', 
      'Tính năng này sẽ được phát triển để theo dõi chế độ dinh dưỡng của khách hàng.',
      [{ text: 'OK' }]
    );
  };

  const handleBodyMeasurementSave = (measurements) => {
    setForm(prev => ({ ...prev, bodyMeasurements: measurements }));
    setHasBodyMeasurements(measurements.length > 0);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { 
        backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb' 
      }]}>
        {/* Header */}
        <View style={[styles.modalHeader, { 
          backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
          borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
        }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={isDarkMode ? Colors.darkText : Colors.black} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { 
            color: isDarkMode ? Colors.darkText : Colors.black 
          }]}>
            {customer ? 'Sửa Khách Hàng' : 'Thêm Khách Hàng'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text style={[styles.saveButton, { 
              color: loading ? Colors.gray : Colors.darkGreen 
            }]}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Thông tin cơ bản */}
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>Thông Tin Cơ Bản</Text>
              
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Họ và tên *"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.fullName}
                onChangeText={(text) => setForm(prev => ({ ...prev, fullName: text }))}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Email *"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.email}
                onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Số điện thoại *"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.phone}
                onChangeText={(text) => setForm(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Địa chỉ *"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.address}
                onChangeText={(text) => setForm(prev => ({ ...prev, address: text }))}
                multiline
                numberOfLines={2}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder={customer ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu *"}
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.password}
                onChangeText={(text) => setForm(prev => ({ ...prev, password: text }))}
                secureTextEntry={true}
                autoCapitalize="none"
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Text style={[styles.pickerLabel, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Giới tính
              </Text>
              <SegmentedButtons
                value={form.gender}
                onValueChange={(value) => setForm(prev => ({ ...prev, gender: value }))}
                buttons={genderOptions}
                style={styles.segmentedButtons}
                theme={{
                  colors: {
                    secondaryContainer: Colors.darkGreen,
                    onSecondaryContainer: 'white',
                  }
                }}
              />

              {/* vai_tro = undefined có nghĩa là Business User */}
              {(userData?.additional_info?.vai_tro === undefined || 
                userData?.additional_info?.vai_tro == null ||
                userData?.additional_info?.isBusiness) && (
                <>
                  <Text style={[styles.pickerLabel, { 
                    color: isDarkMode ? Colors.darkText : Colors.black 
                  }]}>
                    Nhân viên phụ trách
                  </Text>
                  <TouchableOpacity
                    style={[styles.employeeSelector, {
                      backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                      borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                    }]}
                    onPress={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                  >
                    <Text style={[styles.employeeSelectorText, {
                      color: form.assignedEmployeeId ? 
                        (isDarkMode ? Colors.darkText : Colors.black) : 
                        (isDarkMode ? Colors.darkSecondary : Colors.gray)
                    }]}>
                      {form.assignedEmployeeId ? 
                        employees.find(emp => emp._id === form.assignedEmployeeId)?.ten || 'Chọn nhân viên' :
                        'Chọn nhân viên phụ trách'
                      }
                    </Text>
                    <Ionicons 
                      name={showEmployeeDropdown ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={isDarkMode ? Colors.darkSecondary : Colors.gray} 
                    />
                  </TouchableOpacity>

                  {/* Dropdown danh sách nhân viên */}
                  {showEmployeeDropdown && (
                    <View style={[styles.employeeDropdown, {
                      backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
                      borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                    }]}>
                      <TouchableOpacity
                        style={[styles.employeeOption, {
                          borderBottomColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                        }]}
                        onPress={() => {
                          setForm(prev => ({ ...prev, assignedEmployeeId: '' }));
                          setShowEmployeeDropdown(false);
                        }}
                      >
                        <Text style={[styles.employeeOptionText, {
                          color: isDarkMode ? Colors.darkSecondary : Colors.gray
                        }]}>
                          Không chỉ định
                        </Text>
                      </TouchableOpacity>
                      {employees.map((employee) => (
                        <TouchableOpacity
                          key={employee._id}
                          style={[styles.employeeOption, {
                            borderBottomColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb',
                            backgroundColor: form.assignedEmployeeId === employee._id ? 
                              (Colors.darkGreen + '20') : 'transparent'
                          }]}
                          onPress={() => {
                            setForm(prev => ({ ...prev, assignedEmployeeId: employee._id }));
                            setShowEmployeeDropdown(false);
                          }}
                        >
                          <View style={styles.employeeOptionContent}>
                            <Text style={[styles.employeeOptionText, {
                              color: isDarkMode ? Colors.darkText : Colors.black,
                              fontWeight: form.assignedEmployeeId === employee._id ? '600' : '400'
                            }]}>
                              {employee.ten}
                            </Text>
                            <Text style={[styles.employeeOptionSubtext, {
                              color: isDarkMode ? Colors.darkSecondary : Colors.gray
                            }]}>
                              {employee.additional_info?.chucvu || 'Nhân viên'} • {employee.email}
                            </Text>
                          </View>
                          {form.assignedEmployeeId === employee._id && (
                            <Ionicons 
                              name="checkmark" 
                              size={16} 
                              color={Colors.darkGreen} 
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}

              
            </Card.Content>
          </Card>

          {/* Thông tin thể chất */}
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>Thông Tin Thể Chất</Text>
                {/* Button luôn bị ẩn - chỉ đọc cho tất cả trường hợp */}
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.halfInput, { 
                    // Luôn read-only cho tất cả trường hợp
                    backgroundColor: isDarkMode ? Colors.darkSecondary + '30' : '#f5f5f5',
                    color: isDarkMode ? Colors.darkSecondary : Colors.gray,
                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                  }]}
                  placeholder="Chiều cao (cm)"
                  placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                  value={form.height}
                  onChangeText={(text) => setForm(prev => ({ ...prev, height: text }))}
                  keyboardType="numeric"
                  editable={false}
                />

                <TextInput
                  style={[styles.halfInput, { 
                    // Luôn read-only cho tất cả trường hợp
                    backgroundColor: isDarkMode ? Colors.darkSecondary + '30' : '#f5f5f5',
                    color: isDarkMode ? Colors.darkSecondary : Colors.gray,
                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                  }]}
                  placeholder="Cân nặng (kg)"
                  placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                  value={form.weight}
                  onChangeText={(text) => setForm(prev => ({ ...prev, weight: text }))}
                  keyboardType="numeric"
                  editable={false}
                />
              </View>

              {/* Luôn hiển thị thông báo read-only */}
              <Text style={[styles.readOnlyNotice, {
                color: isDarkMode ? Colors.darkSecondary : Colors.gray
              }]}>
                ℹ️ Thông tin thể chất chỉ được xem, không thể chỉnh sửa
              </Text>

              {(errors.height || errors.weight) && (
                <Text style={styles.errorText}>
                  {errors.height || errors.weight}
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Số đo cơ thể */}
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>Số Đo Cơ Thể</Text>
                {/* Button luôn bị ẩn - chỉ đọc cho tất cả trường hợp */}
              </View>

              {hasBodyMeasurements && (
                <View style={styles.measurementsList}>
                  {form.bodyMeasurements.map((measurement, index) => (
                    <View key={index} style={[styles.measurementItem, {
                      backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb',
                      borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                    }]}>
                      <Text style={[styles.measurementName, { 
                        color: isDarkMode ? Colors.darkText : Colors.black 
                      }]}>{measurement.name}</Text>
                      <Text style={[styles.measurementValue, { 
                        color: isDarkMode ? Colors.darkSecondary : Colors.gray 
                      }]}>{measurement.value} cm</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Luôn hiển thị thông báo read-only */}
              <Text style={[styles.readOnlyNotice, {
                color: isDarkMode ? Colors.darkSecondary : Colors.gray
              }]}>
                ℹ️ Số đo cơ thể chỉ được xem, không thể chỉnh sửa
              </Text>
            </Card.Content>
          </Card>

        </ScrollView>

        {/* Body Measurement Modal đã bị vô hiệu hóa - read-only cho tất cả */}
      </SafeAreaView>
    </Modal>
  );
}

// Component modal số đo cơ thể
function BodyMeasurementModal({ visible, measurements, isDarkMode, onClose, onSave }) {
  const [measurementList, setMeasurementList] = useState(measurements || []);
  const [newMeasurement, setNewMeasurement] = useState({ name: '', value: '' });

  const addMeasurement = () => {
    if (newMeasurement.name.trim() && newMeasurement.value.trim()) {
      setMeasurementList(prev => [...prev, { ...newMeasurement }]);
      setNewMeasurement({ name: '', value: '' });
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    }
  };

  const removeMeasurement = (index) => {
    setMeasurementList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(measurementList);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { 
        backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb' 
      }]}>
        <View style={[styles.modalHeader, { 
          backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
          borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
        }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={isDarkMode ? Colors.darkText : Colors.black} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { 
            color: isDarkMode ? Colors.darkText : Colors.black 
          }]}>Số Đo Cơ Thể</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: Colors.darkGreen }]}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Thêm số đo mới */}
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>Thêm Số Đo Mới</Text>
              
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Tên bộ phận (VD: Vòng ngực)"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={newMeasurement.name}
                onChangeText={(text) => setNewMeasurement(prev => ({ ...prev, name: text }))}
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Số đo (cm)"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={newMeasurement.value}
                onChangeText={(text) => setNewMeasurement(prev => ({ ...prev, value: text }))}
                keyboardType="numeric"
              />

              <Button
                mode="contained"
                onPress={addMeasurement}
                style={[styles.addButton, { backgroundColor: Colors.darkGreen }]}
                icon="plus"
              >
                Thêm Bộ Phận
              </Button>
            </Card.Content>
          </Card>

          {/* Danh sách số đo */}
          {measurementList.length > 0 && (
            <Card style={[styles.formSection, { 
              backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
              borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
            }]}>
              <Card.Content>
                <Text style={[styles.sectionTitle, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>Danh Sách Số Đo</Text>
                
                {measurementList.map((measurement, index) => (
                  <View key={index} style={[styles.measurementRow, {
                    backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb',
                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                  }]}>
                    <View style={styles.measurementInfo}>
                      <Text style={[styles.measurementName, { 
                        color: isDarkMode ? Colors.darkText : Colors.black 
                      }]}>{measurement.name}</Text>
                      <Text style={[styles.measurementValue, { 
                        color: isDarkMode ? Colors.darkSecondary : Colors.gray 
                      }]}>{measurement.value} cm</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => removeMeasurement(index)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  formSection: {
    margin: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionButton: {
    minWidth: 80,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  employeeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  employeeSelectorText: {
    fontSize: 16,
    flex: 1,
  },
  employeeDropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    maxHeight: 200,
  },
  employeeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  employeeOptionContent: {
    flex: 1,
  },
  employeeOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  employeeOptionSubtext: {
    fontSize: 12,
  },
  readOnlyNotice: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  debugText: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 8,
    padding: 4,
    backgroundColor: '#ffeb3b20',
    borderRadius: 4,
  },
  goalsContainer: {
    marginBottom: 12,
  },
  goalChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  goalChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  measurementsList: {
    gap: 8,
  },
  measurementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  measurementName: {
    fontSize: 14,
    fontWeight: '500',
  },
  measurementValue: {
    fontSize: 14,
  },
  addButton: {
    marginTop: 8,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  measurementInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});