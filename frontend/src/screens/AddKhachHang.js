import React, { useState } from 'react';
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
  SegmentedButtons
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function AddKhachHang({ 
  visible, 
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
    dateOfBirth: '',
    height: '',
    weight: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalNotes: '',
    fitnessGoal: ''
  });

  const [errors, setErrors] = useState({});

  const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
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

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Lỗi', 'Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    const customerData = {
      ...form,
      id: Date.now(), // Temporary ID
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNkZGRkZGQiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyMCIgcj0iOCIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNNDAgNDBDNDAgMzMuMzcyNiAzMy42Mjc0IDI4IDI1IDI4QzE2LjM3MjYgMjggMTAgMzMuMzcyNiAxMCA0MEg0MFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+',
      joinDate: new Date().toLocaleDateString('vi-VN'),
      assignedTo: 'current_user' // Nhân viên hiện tại
    };

    onSave(customerData);
    onClose();
    
    // Reset form
    setForm({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      gender: 'male',
      dateOfBirth: '',
      height: '',
      weight: '',
      emergencyContact: '',
      emergencyPhone: '',
      medicalNotes: '',
      fitnessGoal: ''
    });
    setErrors({});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.container, { 
        backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background 
      }]}>
        {/* Header */}
        <View style={[styles.header, { 
          backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
          borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
        }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons 
              name="close" 
              size={24} 
              color={isDarkMode ? Colors.darkText : Colors.black} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { 
            color: isDarkMode ? Colors.darkText : Colors.black 
          }]}>
            Thêm Khách Hàng Mới
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: Colors.darkGreen }]}>
              Lưu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Thông tin cơ bản */}
          <Card style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Thông Tin Cơ Bản
              </Text>
              
              <TextInput
                label="Họ và tên *"
                value={form.fullName}
                onChangeText={(text) => setForm(prev => ({ ...prev, fullName: text }))}
                style={[styles.input, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                }]}
                textColor={isDarkMode ? Colors.darkText : Colors.black}
                error={!!errors.fullName}
                theme={{
                  colors: {
                    primary: Colors.darkGreen,
                    text: isDarkMode ? Colors.darkText : Colors.black,
                    background: isDarkMode ? Colors.darkBackground : Colors.white
                  }
                }}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}

              <TextInput
                label="Email *"
                value={form.email}
                onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                }]}
                textColor={isDarkMode ? Colors.darkText : Colors.black}
                error={!!errors.email}
                theme={{
                  colors: {
                    primary: Colors.darkGreen,
                    text: isDarkMode ? Colors.darkText : Colors.black,
                    background: isDarkMode ? Colors.darkBackground : Colors.white
                  }
                }}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                label="Số điện thoại *"
                value={form.phone}
                onChangeText={(text) => setForm(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                style={[styles.input, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                }]}
                textColor={isDarkMode ? Colors.darkText : Colors.black}
                error={!!errors.phone}
                theme={{
                  colors: {
                    primary: Colors.darkGreen,
                    text: isDarkMode ? Colors.darkText : Colors.black,
                    background: isDarkMode ? Colors.darkBackground : Colors.white
                  }
                }}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              <TextInput
                label="Địa chỉ *"
                value={form.address}
                onChangeText={(text) => setForm(prev => ({ ...prev, address: text }))}
                multiline
                numberOfLines={2}
                style={[styles.input, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                }]}
                textColor={isDarkMode ? Colors.darkText : Colors.black}
                error={!!errors.address}
                theme={{
                  colors: {
                    primary: Colors.darkGreen,
                    text: isDarkMode ? Colors.darkText : Colors.black,
                    background: isDarkMode ? Colors.darkBackground : Colors.white
                  }
                }}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}

              <Text style={[styles.fieldLabel, { 
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

              <TextInput
                label="Ngày sinh (dd/mm/yyyy)"
                value={form.dateOfBirth}
                onChangeText={(text) => setForm(prev => ({ ...prev, dateOfBirth: text }))}
                placeholder="VD: 01/01/1990"
                style={[styles.input, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                }]}
                textColor={isDarkMode ? Colors.darkText : Colors.black}
                theme={{
                  colors: {
                    primary: Colors.darkGreen,
                    text: isDarkMode ? Colors.darkText : Colors.black,
                    background: isDarkMode ? Colors.darkBackground : Colors.white
                  }
                }}
              />
            </Card.Content>
          </Card>

          {/* Thông tin thể chất */}
          <Card style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Thông Tin Thể Chất
              </Text>

              <View style={styles.row}>
                <TextInput
                  label="Chiều cao (cm)"
                  value={form.height}
                  onChangeText={(text) => setForm(prev => ({ ...prev, height: text }))}
                  keyboardType="numeric"
                  style={[styles.halfInput, {
                    backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                  }]}
                  textColor={isDarkMode ? Colors.darkText : Colors.black}
                  error={!!errors.height}
                  theme={{
                    colors: {
                      primary: Colors.darkGreen,
                      text: isDarkMode ? Colors.darkText : Colors.black,
                      background: isDarkMode ? Colors.darkBackground : Colors.white
                    }
                  }}
                />

                <TextInput
                  label="Cân nặng (kg)"
                  value={form.weight}
                  onChangeText={(text) => setForm(prev => ({ ...prev, weight: text }))}
                  keyboardType="numeric"
                  style={[styles.halfInput, {
                    backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                  }]}
                  textColor={isDarkMode ? Colors.darkText : Colors.black}
                  error={!!errors.weight}
                  theme={{
                    colors: {
                      primary: Colors.darkGreen,
                      text: isDarkMode ? Colors.darkText : Colors.black,
                      background: isDarkMode ? Colors.darkBackground : Colors.white
                    }
                  }}
                />
              </View>

              {(errors.height || errors.weight) && (
                <Text style={styles.errorText}>
                  {errors.height || errors.weight}
                </Text>
              )}

              <Text style={[styles.fieldLabel, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Mục tiêu tập luyện
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.goalsContainer}
              >
                {fitnessGoals.map((goal, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.goalChip, {
                      backgroundColor: form.fitnessGoal === goal 
                        ? Colors.darkGreen 
                        : (isDarkMode ? Colors.darkBackground : '#f3f4f6'),
                      borderColor: form.fitnessGoal === goal 
                        ? Colors.darkGreen 
                        : (isDarkMode ? Colors.darkSecondary : '#d1d5db')
                    }]}
                    onPress={() => setForm(prev => ({ 
                      ...prev, 
                      fitnessGoal: prev.fitnessGoal === goal ? '' : goal 
                    }))}
                  >
                    <Text style={[styles.goalChipText, {
                      color: form.fitnessGoal === goal 
                        ? 'white' 
                        : (isDarkMode ? Colors.darkText : Colors.black)
                    }]}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Card.Content>
          </Card>

          {/* Thông tin liên hệ khẩn cấp */}
          <Card style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Liên Hệ Khẩn Cấp
              </Text>

              <TextInput
                label="Tên người liên hệ"
                value={form.emergencyContact}
                onChangeText={(text) => setForm(prev => ({ ...prev, emergencyContact: text }))}
                style={[styles.input, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                }]}
                textColor={isDarkMode ? Colors.darkText : Colors.black}
                theme={{
                  colors: {
                    primary: Colors.darkGreen,
                    text: isDarkMode ? Colors.darkText : Colors.black,
                    background: isDarkMode ? Colors.darkBackground : Colors.white
                  }
                }}
              />

              <TextInput
                label="Số điện thoại khẩn cấp"
                value={form.emergencyPhone}
                onChangeText={(text) => setForm(prev => ({ ...prev, emergencyPhone: text }))}
                keyboardType="phone-pad"
                style={[styles.input, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                }]}
                textColor={isDarkMode ? Colors.darkText : Colors.black}
                theme={{
                  colors: {
                    primary: Colors.darkGreen,
                    text: isDarkMode ? Colors.darkText : Colors.black,
                    background: isDarkMode ? Colors.darkBackground : Colors.white
                  }
                }}
              />
            </Card.Content>
          </Card>

          {/* Ghi chú y tế */}
          <Card style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Ghi Chú Y Tế
              </Text>

              <TextInput
                label="Tình trạng sức khỏe, chấn thương, allergies..."
                value={form.medicalNotes}
                onChangeText={(text) => setForm(prev => ({ ...prev, medicalNotes: text }))}
                multiline
                numberOfLines={4}
                style={[styles.textArea, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white
                }]}
                textColor={isDarkMode ? Colors.darkText : Colors.black}
                theme={{
                  colors: {
                    primary: Colors.darkGreen,
                    text: isDarkMode ? Colors.darkText : Colors.black,
                    background: isDarkMode ? Colors.darkBackground : Colors.white
                  }
                }}
              />
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginBottom: 0,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
    marginBottom: 12,
  },
  textArea: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
  },
  segmentedButtons: {
    marginBottom: 12,
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
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});