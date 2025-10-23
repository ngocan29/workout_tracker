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
  ActivityIndicator,
} from 'react-native';
import { Card, Button, FAB, Avatar, Searchbar, DataTable, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../app-example/constants/Colors';
import { AuthService, EmployeeService } from '../services/api'; // Import both services

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function EmployeesScreen({ isDarkMode }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load employees from API
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await EmployeeService.getAllEmployees();
      
      // Transform API data to match frontend format
      const transformedEmployees = response.map(employee => ({
        id: employee._id,
        fullName: employee.userID?.ten || 'N/A',
        email: employee.userID?.email || 'N/A',
        phone: employee.userID?.sodienthoai || 'N/A',
        address: employee.userID?.diachi || 'N/A',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.userID?.ten || 'User')}&background=random`,
        joinDate: new Date(employee.ngaybatdau).toLocaleDateString('vi-VN'),
        position: employee.chucvu || 'Nhân viên',
        salary: employee.luong || '0',
        status: employee.trangthai || 'active',
        // Additional employee fields
        workingHours: employee.giolamviec || 'N/A',
        experience: employee.kinhnghiem || 'N/A'
      }));
      
      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách nhân viên');
      
      // Fallback to sample data if API fails
      const sampleEmployees = [
        {
          id: '1',
          fullName: 'Phạm Thành Đạt',
          email: 'phamthanhdat@gmail.com',
          phone: '0903456789',
          address: '789 Lê Văn Sỹ, Q3, HCM',
          avatar: 'https://ui-avatars.com/api/?name=Pham+Thanh+Dat&background=random',
          joinDate: '01/12/2023',
          position: 'PT Manager',
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
          joinDate: '10/01/2024',
          position: 'Personal Trainer',
          salary: '12000000',
          status: 'active'
        },
      ];
      setEmployees(sampleEmployees);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee => 
      employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone.includes(searchQuery) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())
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
          onPress: async () => {
            try {
              setLoading(true);
              await EmployeeService.deleteEmployee(employeeId);
              
              // Remove from local state
              setEmployees(prev => prev.filter(e => e.id !== employeeId));
              Alert.alert('Thành công', 'Đã xóa nhân viên');
            } catch (error) {
              console.error('Error deleting employee:', error);
              Alert.alert('Lỗi', 'Không thể xóa nhân viên');
            } finally {
              setLoading(false);
            }
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
              <View style={styles.positionContainer}>
                <Chip 
                  style={[styles.positionChip, { backgroundColor: Colors.darkGreen + '20' }]}
                  textStyle={{ color: Colors.darkGreen, fontSize: 12 }}
                  compact
                >
                  {item.position}
                </Chip>
              </View>
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.darkGreen} />
            <Text style={[styles.loadingText, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
              Đang tải dữ liệu...
            </Text>
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
          onSave={async (employeeData) => {
            try {
              setLoading(true);
              
              if (selectedEmployee) {
                // Update existing employee
                await EmployeeService.updateEmployee(selectedEmployee.id, employeeData);
                setEmployees(prev => 
                  prev.map(e => e.id === selectedEmployee.id ? { ...e, ...employeeData } : e)
                );
                Alert.alert('Thành công', 'Đã cập nhật thông tin nhân viên');
              } else {
                // Add new employee
                const response = await EmployeeService.createEmployee(employeeData);
                const newEmployee = {
                  id: response._id || Date.now().toString(),
                  ...employeeData,
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeData.fullName)}&background=random`,
                  joinDate: new Date().toLocaleDateString('vi-VN'),
                  status: 'active'
                };
                setEmployees(prev => [newEmployee, ...prev]);
                Alert.alert('Thành công', 'Đã thêm nhân viên mới');
              }
              setShowAddModal(false);
            } catch (error) {
              console.error('Error saving employee:', error);
              Alert.alert('Lỗi', 'Không thể lưu thông tin nhân viên');
            } finally {
              setLoading(false);
            }
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
    height: '',
    weight: '',
    bodyMeasurements: []
  });
  const [showBodyMeasurementModal, setShowBodyMeasurementModal] = useState(false);
  const [hasNutritionData, setHasNutritionData] = useState(false);
  const [hasBodyMeasurements, setHasBodyMeasurements] = useState(false);
  const [isSearchingEmail, setIsSearchingEmail] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user data to check permissions
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    getCurrentUser();
  }, [visible]);

  // Check if current user can edit body measurements and nutrition
  const canEditBodyData = () => {
    if (!currentUser) return false;
    // Only personal users can edit their own body data, or the employee themselves
    // Business users cannot edit employee's body measurements and nutrition
    return currentUser.loai_tai_khoan === 'personal' || 
           (employee && currentUser._id === employee.userID) || 
           !employee; // Allow when adding new employee
  };

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
    } else {
      // Reset form for new employee
      setForm({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        position: '',
        salary: '',
        height: '',
        weight: '',
        bodyMeasurements: []
      });
      setHasNutritionData(false);
      setHasBodyMeasurements(false);
    }
  }, [employee, visible]);

  const searchUserByEmail = async (email) => {
    if (!email || !email.includes('@')) return;
    
    try {
      setIsSearchingEmail(true);
      const userResponse = await AuthService.searchUserByEmail(email);
      
      if (userResponse) {
        // Auto-fill form with user data
        setForm(prev => ({
          ...prev,
          fullName: userResponse.ten || prev.fullName,
          phone: userResponse.sodienthoai || prev.phone,
          address: userResponse.diachi || prev.address,
        }));
        
        Alert.alert('Thành công', 'Đã tìm thấy thông tin người dùng và tự động điền vào form');
      }
    } catch (error) {
      // Don't show error for user not found - it's normal
      console.log('User search result:', error.message);
    } finally {
      setIsSearchingEmail(false);
    }
  };

  const handleEmailChange = (text) => {
    setForm(prev => ({ ...prev, email: text }));
  };

  const handleEmailBlur = () => {
    if (form.email) {
      searchUserByEmail(form.email);
    }
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
          <TouchableOpacity onPress={() => {
            if (!form.fullName || !form.email || !form.phone || !form.position) {
              Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
              return;
            }
            onSave(form);
          }}>
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

              <View style={{ position: 'relative' }}>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                    color: isDarkMode ? Colors.darkText : Colors.black,
                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                  }]}
                  placeholder="Email * (nhập email để tự động tìm thông tin)"
                  placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                  value={form.email}
                  onChangeText={handleEmailChange}
                  onBlur={handleEmailBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isSearchingEmail && (
                  <View style={styles.searchingIndicator}>
                    <Text style={{ fontSize: 12, color: Colors.primary }}>🔍 Đang tìm kiếm...</Text>
                  </View>
                )}
              </View>

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
            </Card.Content>
          </Card>

          {/* Thông tin thể chất - Only show for personal users or when the employee edits their own data */}
          {canEditBodyData() && (
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

              {/* Column layout with corner labels for each textfield */}
                                <View style={{ flexDirection: 'column' }}>
                                <View style={{ marginBottom: 12 }}>
                                  <View style={{ position: 'relative' }}>
                                  <Text style={{
                                    position: 'absolute',
                                    top: -10,
                                    left: 12,
                                    paddingHorizontal: 6,
                                    fontSize: 12,
                                    color: isDarkMode ? Colors.darkSecondary : Colors.black,
                                    backgroundColor: isDarkMode ? Colors.darkSurface : 'white'
                                  }}>Chiều cao (cm)</Text>
              
                                  <TextInput
                                    style={[styles.input, {
                                    backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                                    color: isDarkMode ? Colors.darkText : Colors.black,
                                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb',
                                    paddingTop: 18 // give space for label
                                    }]}
                                    placeholder=""
                                    placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                                    value={form.height}
                                    onChangeText={(text) => setForm(prev => ({ ...prev, height: text }))}
                                    keyboardType="numeric"
                                  />
                                  </View>
                                </View>
              
                                <View style={{ marginBottom: 12 }}>
                                  <View style={{ position: 'relative' }}>
                                  <Text style={{
                                    position: 'absolute',
                                    top: -10,
                                    left: 12,
                                    paddingHorizontal: 6,
                                    fontSize: 12,
                                    color: isDarkMode ? Colors.darkSecondary : Colors.black,
                                    backgroundColor: isDarkMode ? Colors.darkSurface : 'white'
                                  }}>Cân nặng (kg)</Text>
              
                                  <TextInput
                                    style={[styles.input, {
                                    backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                                    color: isDarkMode ? Colors.darkText : Colors.black,
                                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb',
                                    paddingTop: 18
                                    }]}
                                    placeholder=""
                                    placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                                    value={form.weight}
                                    onChangeText={(text) => setForm(prev => ({ ...prev, weight: text }))}
                                    keyboardType="numeric"
                                  />
                                  </View>
                                </View>
                                </View>
            </Card.Content>
          </Card>
          )}

          {/* Số đo cơ thể - Only show for personal users or when the employee edits their own data */}
          {canEditBodyData() && (
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
          )}
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
                placeholder="Tên bộ phận (VD: Eo, Ngực, Bắp tay,...)"
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
  searchingIndicator: {
    position: 'absolute',
    right: 10,
    top: 15,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});