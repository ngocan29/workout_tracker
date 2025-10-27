import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card, Button, FAB, Avatar, Searchbar, DataTable, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function EmployeesScreen({ isDarkMode }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // Sample data - replace with API calls
    const sampleEmployees = [
      {
        id: '1',
        fullName: 'Phạm Thành Đạt',
        email: 'phamthanhdat@gmail.com',
        phone: '0903456789',
        address: '789 Lê Văn Sỹ, Q3, HCM',
        avatar: 'https://ui-avatars.com/api/?name=Pham+Thanh+Dat&background=random',
        joinDate: '2023-12-01',
        salary: '15000000',
        status: 'active'
      },
      {
        id: '2', 
        fullName: 'Lê Thị Mai',
        email: 'lethimai@gmail.com',
        phone: '0908765432',
        address: '321 Pasteur, Q1, HCM',
        avatar: 'https://ui-avatars.com/api/?name=Le+Thi+Mai&background=random',
        joinDate: '2024-01-10',
        salary: '12000000',
        status: 'active'
      },
    ];
    
    // TODO: Replace with actual API call
    setEmployees(sampleEmployees);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee => 
      employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone.includes(searchQuery) 
    );
    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowAddModal(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa nhân viên này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => {
            setEmployees(prev => prev.filter(e => e.id !== employeeId));
          }
        }
      ]
    );
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(salary);
  };

  const renderEmployeeCard = ({ item }) => (
    <Card style={[styles.employeeCard, { 
      backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
      borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
    }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.employeeInfo}>
            <Avatar.Image 
              size={50} 
              source={{ uri: item.avatar }}
              style={styles.avatar}
            />
            <View style={styles.employeeDetails}>
              <Text style={[styles.employeeName, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>{item.fullName}</Text>
              <Text style={[styles.employeeEmail, { 
                color: isDarkMode ? Colors.darkSecondary : Colors.gray 
              }]}>{item.email}</Text>
              <Text style={[styles.employeePhone, { 
                color: isDarkMode ? Colors.darkSecondary : Colors.gray 
              }]}>{item.phone}</Text>
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity 
              onPress={() => handleEditEmployee(item)}
              style={styles.actionButton}
            >
              <Ionicons name="create-outline" size={20} color={Colors.darkGreen} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDeleteEmployee(item.id)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.employeeMeta}>
          <Text style={[styles.metaText, { 
            color: isDarkMode ? Colors.darkSecondary : Colors.gray 
          }]}>📍 {item.address}</Text>
          <Text style={[styles.metaText, { 
            color: isDarkMode ? Colors.darkSecondary : Colors.gray 
          }]}>💰 {formatSalary(item.salary)}</Text>
          <Text style={[styles.metaText, { 
            color: isDarkMode ? Colors.darkSecondary : Colors.gray 
          }]}>📅 Tham gia: {item.joinDate}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderTableView = () => (
    <View style={[styles.tableContainer, { 
      backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
      borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
    }]}>
      <DataTable>
        <DataTable.Header style={{ 
          backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb' 
        }}>
          <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Nhân viên
            </Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Chức vụ
            </Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Email
            </Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Lương
            </Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Thao tác
            </Text>
          </DataTable.Title>
        </DataTable.Header>

        {filteredEmployees.map((employee) => (
          <DataTable.Row key={employee.id} style={{ 
            borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb' 
          }}>
            <DataTable.Cell>
              <View style={styles.tableUserInfo}>
                <Avatar.Image size={32} source={{ uri: employee.avatar }} />
                <Text style={[styles.tableUserName, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>{employee.fullName}</Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell>
              <Chip 
                style={{ backgroundColor: Colors.darkGreen + '20' }}
                textStyle={{ color: Colors.darkGreen, fontSize: 11 }}
                compact
              >
                {employee.position}
              </Chip>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black }}>
                {employee.email}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ 
                color: isDarkMode ? Colors.darkText : Colors.black,
                fontWeight: '500'
              }}>
                {formatSalary(employee.salary)}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <View style={styles.tableActions}>
                <TouchableOpacity 
                  onPress={() => handleEditEmployee(employee)}
                  style={[styles.tableActionButton, { backgroundColor: Colors.darkGreen + '20' }]}
                >
                  <Ionicons name="create-outline" size={16} color={Colors.darkGreen} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDeleteEmployee(employee.id)}
                  style={[styles.tableActionButton, { backgroundColor: '#ef444420' }]}
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );

  return (
    <View style={[styles.container, { 
      backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb' 
    }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
        borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
      }]}>
        <Text style={[styles.headerTitle, { 
          color: isDarkMode ? Colors.darkText : Colors.black 
        }]}>Quản Lý Nhân Viên</Text>
        <Text style={[styles.headerSubtitle, { 
          color: isDarkMode ? Colors.darkSecondary : Colors.gray 
        }]}>Tổng: {filteredEmployees.length} nhân viên</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm kiếm theo tên, email, số điện thoại, chức vụ..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}
          inputStyle={{ color: isDarkMode ? Colors.darkText : Colors.black }}
          iconColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isTablet ? renderTableView() : (
          <FlatList
            data={filteredEmployees}
            renderItem={renderEmployeeCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <FAB
        style={[styles.fab, { backgroundColor: Colors.darkGreen }]}
        icon="plus"
        onPress={handleAddEmployee}
        color="white"
      />

      {/* Add/Edit Employee Modal */}
      {showAddModal && (
        <EmployeeFormModal
          visible={showAddModal}
          employee={selectedEmployee}
          isDarkMode={isDarkMode}
          onClose={() => setShowAddModal(false)}
          onSave={(employeeData) => {
            if (selectedEmployee) {
              // Update existing employee
              setEmployees(prev => 
                prev.map(e => e.id === selectedEmployee.id ? { ...e, ...employeeData } : e)
              );
            } else {
              // Add new employee
              const newEmployee = {
                id: Date.now().toString(),
                ...employeeData,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeData.fullName)}&background=random`,
                joinDate: new Date().toLocaleDateString('vi-VN'),
                status: 'active'
              };
              setEmployees(prev => [newEmployee, ...prev]);
            }
            setShowAddModal(false);
          }}
        />
      )}
    </View>
  );
}

// Component modal form thêm/sửa nhân viên
function EmployeeFormModal({ visible, employee, isDarkMode, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    salary: '',
    gender: 'male', // Thêm trường giới tính
    height: '',
    weight: '',
    bodyMeasurements: []
  });
  const [showBodyMeasurementModal, setShowBodyMeasurementModal] = useState(false);
  const [hasNutritionData, setHasNutritionData] = useState(false);
  const [hasBodyMeasurements, setHasBodyMeasurements] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        fullName: employee.fullName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        position: employee.position || '',
        salary: employee.salary || '',
        height: employee.height || '',
        weight: employee.weight || '',
        bodyMeasurements: employee.bodyMeasurements || []
      });
      setHasNutritionData(!!employee.height && !!employee.weight);
      setHasBodyMeasurements(employee.bodyMeasurements?.length > 0);
    }
  }, [employee]);

  const handleSave = () => {
    if (!form.fullName || !form.email || !form.phone || !form.position) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    onSave(form);
  };

  const handleUpdateNutrition = () => {
    if (!form.height || !form.weight) {
      Alert.alert('Lỗi', 'Vui lòng nhập chiều cao và cân nặng');
      return;
    }
    setHasNutritionData(true);
    Alert.alert('Thành công', 'Đã cập nhật thông tin thể chất');
  };

  const handleBodyMeasurementSave = (measurements) => {
    setForm(prev => ({ ...prev, bodyMeasurements: measurements }));
    setHasBodyMeasurements(measurements.length > 0);
    setShowBodyMeasurementModal(false);
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
                placeholder="Số điện thoại *"
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
                onChangeText={(text) => setForm(prev => ({ ...prev, salary: text }))}
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

              {/* Trường chọn giới tính */}
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

              <TextInput
                style={[styles.input, { 
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
                style={[styles.input, { 
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
      </View>
    </Modal>
  );
}

// Component modal số đo cơ thể (tái sử dụng từ CustomersScreen)
function BodyMeasurementModal({ visible, measurements, isDarkMode, onClose, onSave }) {
  const [measurementList, setMeasurementList] = useState(measurements || []);
  const [newMeasurement, setNewMeasurement] = useState({ name: '', value: '' });

  const addMeasurement = () => {
    if (!newMeasurement.name || !newMeasurement.value) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên bộ phận và số đo');
      return;
    }
    
    setMeasurementList(prev => [...prev, { ...newMeasurement }]);
    setNewMeasurement({ name: '', value: '' });
  };

  const removeMeasurement = (index) => {
    setMeasurementList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(measurementList);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.modalContainer, { 
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
          {/* Form thêm số đo mới */}
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  employeeCard: {
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  employeeInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  positionContainer: {
    marginBottom: 4,
  },
  positionChip: {
    alignSelf: 'flex-start',
  },
  employeeEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  employeePhone: {
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  employeeMeta: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metaText: {
    fontSize: 12,
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  tableContainer: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tableUserName: {
    fontWeight: '500',
  },
  tableActions: {
    flexDirection: 'row',
    gap: 4,
  },
  tableActionButton: {
    padding: 6,
    borderRadius: 6,
  },
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
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
});