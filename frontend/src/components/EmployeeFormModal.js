import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../constants/Colors';
import { createEmployee, updateEmployee } from '../services/employeeApi';

export default function EmployeeFormModal({ visible, employee, isDarkMode, onClose, onSave, userData }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    salary: '',
    password: '', // Thêm trường mật khẩu
    gender: 'male',
    height: '',
    weight: '',
    bodyMeasurements: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Format number with VN locale
  const formatNumber = (value) => {
    if (!value) return '';
    // Remove all non-digit characters
    const number = value.toString().replace(/\D/g, '');
    if (!number) return '';
    // Format with VN locale
    return parseInt(number).toLocaleString('vi-VN');
  };

  // Parse VN formatted number to integer
  const parseNumber = (value) => {
    if (!value) return 0;
    // Remove all non-digit characters
    const number = value.toString().replace(/\D/g, '');
    return parseInt(number) || 0;
  };

  // Handle salary input with VN formatting
  const handleSalaryChange = (text) => {
    // Allow only digits and format with VN locale
    const formatted = formatNumber(text);
    setForm(prev => ({ ...prev, salary: formatted }));
  };

  useEffect(() => {
    if (employee) {
      setForm({
        fullName: employee.fullName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        position: employee.position || '',
        salary: employee.salary ? formatNumber(employee.salary) : '',
        password: '', // Không hiển thị mật khẩu hiện tại
        gender: employee.gender || 'male',
        height: employee.height?.toString() || '',
        weight: employee.weight?.toString() || '',
        bodyMeasurements: employee.bodyMeasurements || []
      });
    } else {
      // Reset form khi tạo mới
      setForm({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        position: '',
        salary: '',
        password: '',
        gender: 'male',
        height: '',
        weight: '',
        bodyMeasurements: []
      });
    }
  }, [employee]);

  const handleSave = async () => {
    // Validation
    if (!form.fullName || !form.email || !form.position) {
      setErrors({ general: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
      return;
    }
    
    // Validation mật khẩu cho trường hợp tạo mới
    if (!employee && !form.password) {
      setErrors({ password: 'Mật khẩu là bắt buộc khi tạo nhân viên mới' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data for API
      const employeeData = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
        position: form.position,
        salary: parseNumber(form.salary), // Convert VN formatted number to integer
        chinhanhID: userData?.additional_info?.chinhanhID
      };

      // Include password if provided
      if (form.password) {
        employeeData.password = form.password;
      }

      let result;
      if (employee) {
        // Update existing employee
        result = await updateEmployee(employee.id, employeeData);
      } else {
        // Create new employee
        result = await createEmployee(employeeData);
      }

      if (result.success) {
        onSave(result);
      } else {
        setErrors({ general: result.error || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      setErrors({ general: 'Có lỗi xảy ra khi lưu thông tin' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.modalContainer, { 
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
            {employee ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên'}
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
          {/* Hiển thị lỗi chung */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

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
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Số điện thoại"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.phone}
                onChangeText={(text) => setForm(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Chức vụ *"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.position}
                onChangeText={(text) => setForm(prev => ({ ...prev, position: text }))}
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Lương (VNĐ)"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.salary}
                onChangeText={handleSalaryChange}
                keyboardType="numeric"
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Địa chỉ"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.address}
                onChangeText={(text) => setForm(prev => ({ ...prev, address: text }))}
              />

              {/* Trường mật khẩu */}
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder={employee ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu *"}
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.password}
                onChangeText={(text) => setForm(prev => ({ ...prev, password: text }))}
                secureTextEntry
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {/* Giới tính */}
              <View style={[styles.pickerContainer, { 
                backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
              }]}>
                <Text style={[styles.pickerLabel, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>Giới tính:</Text>
                <Picker
                  selectedValue={form.gender}
                  onValueChange={(value) => setForm(prev => ({ ...prev, gender: value }))}
                  style={[styles.picker, { 
                    color: isDarkMode ? Colors.darkText : Colors.black 
                  }]}
                >
                  <Picker.Item label="Nam" value="male" />
                  <Picker.Item label="Nữ" value="female" />
                </Picker>
              </View>
            </Card.Content>
          </Card>

          Thông tin thể chất (read-only)
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>Thông Tin Thể Chất</Text>

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkSecondary + '30' : '#f5f5f5',
                  color: isDarkMode ? Colors.darkSecondary : Colors.gray,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Chiều cao (cm)"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.height}
                editable={false}
              />

              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkSecondary + '30' : '#f5f5f5',
                  color: isDarkMode ? Colors.darkSecondary : Colors.gray,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Cân nặng (kg)"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.weight}
                editable={false}
              />

              <Text style={[styles.readOnlyNotice, {
                color: isDarkMode ? Colors.darkSecondary : Colors.gray
              }]}>
                ℹ️ Thông tin thể chất chỉ được xem, không thể chỉnh sửa
              </Text>
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
              </View>

              {form.bodyMeasurements && form.bodyMeasurements.length > 0 && (
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

              <Text style={[styles.readOnlyNotice, {
                color: isDarkMode ? Colors.darkSecondary : Colors.gray
              }]}>
                ℹ️ Số đo cơ thể chỉ được xem, không thể chỉnh sửa
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
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
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
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
    height: 40,
  },
  readOnlyNotice: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
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
});