import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card, FAB, Avatar, Searchbar, DataTable, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { getEmployeesByBranch, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeApi';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function EmployeesScreen({ isDarkMode }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data từ AsyncStorage
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const user = JSON.parse(userDataStr);
        setUserData(user);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Load employees khi có userData
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const chinhanhID = userData?.additional_info?.chinhanhID;
      
      if (!chinhanhID) {
        console.error('No branch ID found');
        setLoading(false);
        return;
      }

      const result = await getEmployeesByBranch(chinhanhID);
      
      if (result.success) {
        // Transform data để match với UI expectations
        const transformedEmployees = result.data.map(emp => ({
          id: emp._id,
          fullName: emp.ten || emp.fullName,
          email: emp.email,
          phone: emp.sodienthoai || emp.phone,
          address: emp.diachi || emp.address,
          position: emp.additional_info?.position || emp.position || 'Nhân viên',
          salary: emp.additional_info?.luong || emp.additional_info?.salary || emp.salary || 0,
          gender: emp.gioitinh || emp.gender || 'male',
          joinDate: emp.ngayvao ? new Date(emp.ngayvao).toLocaleDateString('vi-VN') : 'N/A',
          avatar: emp.avatar || 'https://via.placeholder.com/150',
          height: emp.chieucao || emp.height || '',
          weight: emp.cannang || emp.weight || '',
          bodyMeasurements: emp.bodyMeasurements || []
        }));
        
        setEmployees(transformedEmployees);
        setFilteredEmployees(transformedEmployees);
      } else {
        console.error('Failed to load employees:', result.error);
        setEmployees([]);
        setFilteredEmployees([]);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [userData?.additional_info?.chinhanhID]);

  useEffect(() => {
    if (userData) {
      loadEmployees();
    }
  }, [userData, loadEmployees]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.phone.includes(searchQuery) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowAddModal(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    // Use browser native dialog for web compatibility
    const confirmDelete = Platform.OS === 'web' 
      ? window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')
      : await new Promise((resolve) => {
          // For React Native, would use Alert.alert here
          resolve(true); // For now, just proceed
        });

    if (confirmDelete) {
      try {
        console.log('Deleting employee with ID:', employeeId);
        const result = await deleteEmployee(employeeId);
        
        if (result.success) {
          if (Platform.OS === 'web') {
            window.alert('Đã xóa nhân viên thành công');
          }
          loadEmployees(); // Reload danh sách
        } else {
          const errorMsg = 'Không thể xóa nhân viên: ' + result.error;
          if (Platform.OS === 'web') {
            window.alert(errorMsg);
          }
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        const errorMsg = 'Đã xảy ra lỗi khi xóa nhân viên';
        if (Platform.OS === 'web') {
          window.alert(errorMsg);
        }
      }
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return '0 VNĐ';
    return `${parseInt(salary).toLocaleString('vi-VN')} VNĐ`;
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
              style={[styles.actionButton, styles.editButton]}
            >
              <Ionicons name="create-outline" size={20} color={Colors.darkGreen} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDeleteEmployee(item.id)}
              style={[styles.actionButton, styles.deleteButton]}
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
          {/* <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Chức vụ
            </Text>
          </DataTable.Title> */}
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

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm kiếm theo tên, email, số điện thoại,..."
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { 
              color: isDarkMode ? Colors.darkText : Colors.black 
            }]}>Đang tải danh sách nhân viên...</Text>
          </View>
        ) : filteredEmployees.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="people-outline" 
              size={64} 
              color={isDarkMode ? Colors.darkSecondary : Colors.gray} 
            />
            <Text style={[styles.emptyText, { 
              color: isDarkMode ? Colors.darkText : Colors.black 
            }]}>
              {searchQuery ? 'Không tìm thấy nhân viên nào' : 'Chưa có nhân viên nào'}
            </Text>
            {!searchQuery && (
              <Text style={[styles.emptySubtext, { 
                color: isDarkMode ? Colors.darkSecondary : Colors.gray 
              }]}>
                Nhấn nút + để thêm nhân viên mới
              </Text>
            )}
          </View>
        ) : isTablet ? renderTableView() : (
          <FlatList
            data={filteredEmployees}
            renderItem={renderEmployeeCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* FAB */}
      <FAB
        style={[styles.fab, { backgroundColor: Colors.darkGreen }]}
        icon="plus"
        onPress={handleAddEmployee}
        color="white"
      />

      {/* Modal */}
      {showAddModal && (
        <EmployeeFormModal
          visible={showAddModal}
          employee={selectedEmployee}
          isDarkMode={isDarkMode}
          userData={userData}
          onClose={() => {
            setShowAddModal(false);
            setSelectedEmployee(null);
          }}
          onSave={(result) => {
            setShowAddModal(false);
            setSelectedEmployee(null);
            loadEmployees();
          }}
        />
      )}
    </View>
  );
}

// Component modal form thêm/sửa nhân viên
function EmployeeFormModal({ visible, employee, isDarkMode, onClose, onSave, userData }) {
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

              {/* <TextInput
                style={[styles.input, { 
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  color: isDarkMode ? Colors.darkText : Colors.black,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}
                placeholder="Chức vụ *"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.position}
                onChangeText={(text) => setForm(prev => ({ ...prev, position: text }))}
              /> */}

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

          {/* Thông tin thể chất (read-only) */}
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
                          {/* Button luôn bị ẩn - chỉ đọc cho tất cả trường hợp */}
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
          
                        {/* Luôn hiển thị thông báo read-only */}
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
    padding: 12,
    minWidth: 40,
    minHeight: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  editButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
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
});