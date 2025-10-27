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
  Button
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

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
    dateOfBirth: '',
    height: '',
    weight: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalNotes: '',
    fitnessGoal: '',
    bodyMeasurements: []
  });

  const [errors, setErrors] = useState({});
  const [showBodyMeasurementModal, setShowBodyMeasurementModal] = useState(false);
  const [hasNutritionData, setHasNutritionData] = useState(false);
  const [hasBodyMeasurements, setHasBodyMeasurements] = useState(false);

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

  // Load customer data when editing
  useEffect(() => {
    if (customer) {
      setForm({
        fullName: customer.fullName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        gender: customer.gender || 'male',
        dateOfBirth: customer.dateOfBirth || '',
        height: customer.height || '',
        weight: customer.weight || '',
        emergencyContact: customer.emergencyContact || '',
        emergencyPhone: customer.emergencyPhone || '',
        medicalNotes: customer.medicalNotes || '',
        fitnessGoal: customer.fitnessGoal || '',
        bodyMeasurements: customer.bodyMeasurements || []
      });
      
      setHasNutritionData(!!customer.height || !!customer.weight);
      setHasBodyMeasurements(customer.bodyMeasurements && customer.bodyMeasurements.length > 0);
    } else {
      // Reset form for new customer
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
        fitnessGoal: '',
        bodyMeasurements: []
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
      id: customer ? customer.id : Date.now(), // Keep existing ID or create new one
      avatar: customer ? customer.avatar : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNkZGRkZGQiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyMCIgcj0iOCIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNNDAgNDBDNDAgMzMuMzcyNiAzMy42Mjc0IDI4IDI1IDI4QzE2LjM3MjYgMjggMTAgMzMuMzcyNiAxMCA0MEg0MFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+',
      joinDate: customer ? customer.joinDate : new Date().toLocaleDateString('vi-VN'),
      assignedTo: customer ? customer.assignedTo : 'current_user' // Nhân viên hiện tại
    };

    onSave(customerData);
    onClose();
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
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: Colors.darkGreen }]}>Lưu</Text>
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
                <Button
                  mode={hasNutritionData ? "outlined" : "contained"}
                  onPress={handleUpdateNutrition}
                  style={styles.sectionButton}
                  labelStyle={{ fontSize: 12 }}
                >
                  {hasNutritionData ? "Cập nhật" : "Thêm"}
                </Button>
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.halfInput, { 
                    backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                    color: isDarkMode ? Colors.darkText : Colors.black,
                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                  }]}
                  placeholder="Chiều cao (cm)"
                  placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                  value={form.height}
                  onChangeText={(text) => setForm(prev => ({ ...prev, height: text }))}
                  keyboardType="numeric"
                />

                <TextInput
                  style={[styles.halfInput, { 
                    backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                    color: isDarkMode ? Colors.darkText : Colors.black,
                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                  }]}
                  placeholder="Cân nặng (kg)"
                  placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                  value={form.weight}
                  onChangeText={(text) => setForm(prev => ({ ...prev, weight: text }))}
                  keyboardType="numeric"
                />
              </View>

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
                <Button
                  mode={hasBodyMeasurements ? "outlined" : "contained"}
                  onPress={() => setShowBodyMeasurementModal(true)}
                  style={styles.sectionButton}
                  labelStyle={{ fontSize: 12 }}
                >
                  {hasBodyMeasurements ? "Cập nhật" : "Thêm"}
                </Button>
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
            </Card.Content>
          </Card>

        </ScrollView>

        {/* Body Measurement Modal */}
        {showBodyMeasurementModal && (
          <BodyMeasurementModal
            visible={showBodyMeasurementModal}
            measurements={form.bodyMeasurements}
            isDarkMode={isDarkMode}
            onClose={() => setShowBodyMeasurementModal(false)}
            onSave={handleBodyMeasurementSave}
          />
        )}
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