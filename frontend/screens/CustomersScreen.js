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
import { Card, Button, FAB, Avatar, Searchbar, DataTable } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../app-example/constants/Colors';
import { AuthService, CustomerService, EmployeeService, BranchService, PhysicalInfoService, BodyMeasurementService } from '../services/api'; // Import all services

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function CustomersScreen({ isDarkMode }) {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load customers from API
  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await CustomerService.getAllCustomers();
      
      // Transform API data to match frontend format
      const transformedCustomers = await Promise.all(response.map(async (customer) => {
        // Load physical info for each customer
        let physicalInfo = null;
        let bodyMeasurements = [];
        
        try {
          const physicalData = await PhysicalInfoService.getCustomerPhysicalInfo(customer._id);
          physicalInfo = physicalData && physicalData.length > 0 ? physicalData[0] : null;
        } catch (_error) {
          console.log('No physical data for customer:', customer._id);
        }
        
        try {
          const measurementData = await BodyMeasurementService.getCustomerBodyMeasurements(customer._id);
          bodyMeasurements = measurementData && measurementData.length > 0 ? measurementData[0]?.bophan || [] : [];
        } catch (_error) {
          console.log('No body measurements for customer:', customer._id);
        }
        
        return {
          id: customer._id,
          userID: customer.userID?._id || customer.userID, // Include userID for permission checking
          fullName: customer.userID?.ten || 'N/A',
          email: customer.userID?.email || 'N/A',
          phone: customer.userID?.sodienthoai || 'N/A',
          address: customer.userID?.diachi || 'N/A',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.userID?.ten || 'User')}&background=random`,
          joinDate: new Date(customer.ngaydangky).toLocaleDateString('vi-VN'),
          status: customer.trangthai || 'active',
          // Additional customer fields
          points: customer.diemthuong || 0,
          streak: customer.chuoi || 0,
          steps: customer.buocchan || 0,
          // Physical info from database
          physicalInfo: physicalInfo ? {
            height: physicalInfo.chieucao,
            weight: physicalInfo.cannang,
            bmi: physicalInfo.bmi,
            calo: physicalInfo.calo,
            protein: physicalInfo.protein,
            carbs: physicalInfo.carbs,
            fat: physicalInfo.fat
          } : null,
          bodyMeasurements: bodyMeasurements.map(bp => ({
            name: bp.ten,
            value: bp.sodo
          }))
        };
      }));
      
      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách khách hàng');
      
      // Fallback to sample data if API fails
      const sampleCustomers = [
        {
          id: '1',
          userID: 'user1', // Sample userID for testing
          fullName: 'Nguyễn Văn An',
          email: 'nguyenvanan@gmail.com',
          phone: '0901234567',
          address: '123 Lê Lợi, Q1, HCM',
          avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=random',
          joinDate: '15/01/2024',
          status: 'active',
          points: 1250,
          streak: 5,
          steps: 8500
        },
        {
          id: '2', 
          userID: 'user2', // Sample userID for testing
          fullName: 'Trần Thị Bình',
          email: 'tranthibinh@gmail.com',
          phone: '0907654321',
          address: '456 Nguyễn Huệ, Q1, HCM',
          avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=random',
          joinDate: '20/02/2024',
          status: 'active',
          points: 980,
          streak: 3,
          steps: 6200
        },
      ];
      setCustomers(sampleCustomers);
    } finally {
      setLoading(false);
    }
  };

  // Load current user info and default branch
  const loadCurrentUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        try {
          // Lấy chi nhánh mặc định của user business hiện tại (congtyID = userId)
          const defaultBranch = await BranchService.getDefaultBranch(userId);
          setCurrentUser({ 
            id: userId, 
            additional_info: { 
              chinhanhID: defaultBranch._id 
            } 
          });
        } catch (_branchError) {
          console.log('Could not load default branch, using fallback');
          // Fallback nếu không lấy được chi nhánh
          setCurrentUser({ id: userId, additional_info: { chinhanhID: null } });
        }
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      // Fallback
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setCurrentUser({ id: userId, additional_info: { chinhanhID: null } });
      }
    }
  };

  useEffect(() => {
    loadCustomers();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(customer => 
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setShowAddModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowAddModal(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa khách hàng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await CustomerService.deleteCustomer(customerId);
              await loadCustomers(); // Reload data
              Alert.alert('Thành công', 'Đã xóa khách hàng');
            } catch (error) {
              console.error('Error deleting customer:', error);
              Alert.alert('Lỗi', 'Không thể xóa khách hàng');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderCustomerCard = ({ item }) => (
    <Card style={[styles.customerCard, { 
      backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
      borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
    }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.customerInfo}>
            <Avatar.Image 
              size={50} 
              source={{ uri: item.avatar }}
              style={styles.avatar}
            />
            <View style={styles.customerDetails}>
              <Text style={[styles.customerName, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>{item.fullName}</Text>
              <Text style={[styles.customerEmail, { 
                color: isDarkMode ? Colors.darkSecondary : Colors.gray 
              }]}>{item.email}</Text>
              <Text style={[styles.customerPhone, { 
                color: isDarkMode ? Colors.darkSecondary : Colors.gray 
              }]}>{item.phone}</Text>
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity 
              onPress={() => handleEditCustomer(item)}
              style={styles.actionButton}
            >
              <Ionicons name="create-outline" size={20} color={Colors.darkGreen} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDeleteCustomer(item.id)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.customerMeta}>
          <Text style={[styles.metaText, { 
            color: isDarkMode ? Colors.darkSecondary : Colors.gray 
          }]}>📍 {item.address}</Text>
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
              Khách hàng
            </Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Email
            </Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Điện thoại
            </Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Địa chỉ
            </Text>
          </DataTable.Title>
          <DataTable.Title>
            <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black, fontWeight: '600' }}>
              Thao tác
            </Text>
          </DataTable.Title>
        </DataTable.Header>

        {filteredCustomers.map((customer) => (
          <DataTable.Row key={customer.id} style={{ 
            borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb' 
          }}>
            <DataTable.Cell>
              <View style={styles.tableUserInfo}>
                <Avatar.Image size={32} source={{ uri: customer.avatar }} />
                <Text style={[styles.tableUserName, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>{customer.fullName}</Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black }}>
                {customer.email}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black }}>
                {customer.phone}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={{ 
                color: isDarkMode ? Colors.darkSecondary : Colors.gray,
                fontSize: 12
              }} numberOfLines={1}>{customer.address}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <View style={styles.tableActions}>
                <TouchableOpacity 
                  onPress={() => handleEditCustomer(customer)}
                  style={[styles.tableActionButton, { backgroundColor: Colors.darkGreen + '20' }]}
                >
                  <Ionicons name="create-outline" size={16} color={Colors.darkGreen} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDeleteCustomer(customer.id)}
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
        }]}>Quản Lý Khách Hàng</Text>
        <Text style={[styles.headerSubtitle, { 
          color: isDarkMode ? Colors.darkSecondary : Colors.gray 
        }]}>Tổng: {filteredCustomers.length} khách hàng</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
            data={filteredCustomers}
            renderItem={renderCustomerCard}
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
        onPress={handleAddCustomer}
        color="white"
      />

      {/* Add/Edit Customer Modal */}
      {showAddModal && (
        <CustomerFormModal
          visible={showAddModal}
          customer={selectedCustomer}
          isDarkMode={isDarkMode}
          onClose={() => setShowAddModal(false)}
          onSave={async (customerData) => {
            try {
              setLoading(true);
              
              // Prepare data for API
              const apiData = {
                fullName: customerData.fullName,
                email: customerData.email,
                phone: customerData.phone,
                address: customerData.address,
                gender: customerData.gender,
                nhanvienID: customerData.selectedEmployee?.id || null,
                // Thêm vai_tro và chinhanhID cho khách hàng mới
                vai_tro: 'khachhang',
                chinhanhID: currentUser?.additional_info?.chinhanhID || null
              };

              if (selectedCustomer) {
                // Update existing customer
                await CustomerService.updateCustomer(selectedCustomer.id, apiData);
                Alert.alert('Thành công', 'Đã cập nhật thông tin khách hàng');
              } else {
                // Add new customer  
                await CustomerService.createCustomer(apiData);
                Alert.alert('Thành công', 'Đã thêm khách hàng mới');
              }
              
              await loadCustomers(); // Reload data
              setShowAddModal(false);
            } catch (error) {
              console.error('Error saving customer:', error);
              Alert.alert('Lỗi', selectedCustomer ? 'Không thể cập nhật khách hàng' : 'Không thể thêm khách hàng');
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </View>
  );
}

// Component modal form thêm/sửa khách hàng
function CustomerFormModal({ visible, customer, isDarkMode, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    gender: 'male',
    height: '',
    weight: '',
    bodyMeasurements: [],
    selectedEmployee: null,
    employeeSearch: ''
  });
  const [showBodyMeasurementModal, setShowBodyMeasurementModal] = useState(false);
  const [hasNutritionData, setHasNutritionData] = useState(false);
  const [hasBodyMeasurements, setHasBodyMeasurements] = useState(false);
  const [isSearchingEmail, setIsSearchingEmail] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [employeeSearchResults, setEmployeeSearchResults] = useState([]);
  const [isSearchingEmployee, setIsSearchingEmployee] = useState(false);

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
    
    // When adding new customer, only allow if current user is personal type
    if (!customer) {
      return currentUser.loai_tai_khoan === 'personal';
    }
    
    // Only allow editing if:
    // 1. Current user is personal type (customer)
    // 2. AND current user's ID matches the customer's userID
    // This means only the customer themselves can edit their own body data
    return currentUser.loai_tai_khoan === 'personal' && currentUser._id === customer.userID;
  };

  // Handle employee search
  const handleEmployeeSearch = async (searchText) => {
    setForm(prev => ({ ...prev, employeeSearch: searchText }));
    
    if (searchText.length < 2) {
      setEmployeeSearchResults([]);
      return;
    }

    try {
      setIsSearchingEmployee(true);
      // Load all employees and filter by name
      const employees = await EmployeeService.getAllEmployees();
      const filtered = employees
        .map(emp => ({
          id: emp._id,
          fullName: emp.userID?.ten || 'N/A',
          email: emp.userID?.email || 'N/A',
          position: emp.chucvu || 'Nhân viên',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.userID?.ten || 'User')}&background=random`
        }))
        .filter(emp => 
          emp.fullName.toLowerCase().includes(searchText.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 results
      
      setEmployeeSearchResults(filtered);
    } catch (error) {
      console.error('Error searching employees:', error);
      setEmployeeSearchResults([]);
    } finally {
      setIsSearchingEmployee(false);
    }
  };

  // Handle employee selection
  const handleSelectEmployee = (employee) => {
    setForm(prev => ({ 
      ...prev, 
      selectedEmployee: employee,
      employeeSearch: employee.fullName
    }));
    setEmployeeSearchResults([]);
  };

  useEffect(() => {
    if (customer) {
      setForm({
        fullName: customer.fullName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        gender: customer.gender || 'male',
        height: customer.physicalInfo?.height?.toString() || '',
        weight: customer.physicalInfo?.weight?.toString() || '',
        bodyMeasurements: customer.bodyMeasurements || [],
        selectedEmployee: customer.selectedEmployee || null,
        employeeSearch: customer.selectedEmployee?.fullName || ''
      });
      setHasNutritionData(!!customer.physicalInfo?.height && !!customer.physicalInfo?.weight);
      setHasBodyMeasurements((customer.bodyMeasurements || []).length > 0);
    } else {
      // Reset form for new customer
      setForm({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        gender: 'male',
        height: '',
        weight: '',
        bodyMeasurements: [],
        selectedEmployee: null,
        employeeSearch: ''
      });
      setHasNutritionData(false);
      setHasBodyMeasurements(false);
    }
  }, [customer, visible]);

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

  const handleSave = () => {
    if (!form.fullName || !form.email || !form.phone) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    // If user is not personal and trying to add body data to new customer, warn them
    if (!customer && currentUser?.loai_tai_khoan !== 'personal' && (form.height || form.weight || form.bodyMeasurements?.length > 0)) {
      Alert.alert(
        'Cảnh báo', 
        'Thông tin thể chất và số đo cơ thể sẽ không được lưu vì chỉ khách hàng mới có thể quản lý thông tin này.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Tiếp tục', onPress: () => {
            // Remove body data before saving
            const formWithoutBodyData = {
              ...form,
              height: '',
              weight: '',
              bodyMeasurements: []
            };
            onSave(formWithoutBodyData);
          }}
        ]
      );
      return;
    }
    
    onSave(form);
  };

  const handleUpdateNutrition = async () => {
    if (!canEditBodyData()) {
      Alert.alert('Không có quyền', 'Chỉ khách hàng mới có thể chỉnh sửa thông tin thể chất của chính mình');
      return;
    }
    
    if (!form.height || !form.weight) {
      Alert.alert('Lỗi', 'Vui lòng nhập chiều cao và cân nặng');
      return;
    }
    
    try {
      const physicalData = {
        chieucao: parseFloat(form.height),
        cannang: parseFloat(form.weight),
        calo: 2000, // Default value, có thể tính toán dựa trên BMR
        luongnuoc: 2.5 // Default value
      };
      
      if (customer) {
        // Update for existing customer
        await PhysicalInfoService.createCustomerPhysicalInfo(customer.id, physicalData);
      } else {
        // Personal user updating their own data
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          await PhysicalInfoService.createPersonalPhysicalInfo(userId, physicalData);
        }
      }
      
      setHasNutritionData(true);
      Alert.alert('Thành công', 'Đã cập nhật thông tin thể chất');
    } catch (error) {
      console.error('Error updating physical info:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin thể chất');
    }
  };

  const handleBodyMeasurementSave = async (measurements) => {
    try {
      if (!canEditBodyData()) {
        Alert.alert('Không có quyền', 'Chỉ khách hàng mới có thể chỉnh sửa số đo cơ thể của chính mình');
        return;
      }
      
      const measurementData = {
        bophan: measurements.map(m => ({
          ten: m.name,
          sodo: parseFloat(m.value)
        }))
      };
      
      if (customer) {
        // Update for existing customer
        await BodyMeasurementService.createCustomerBodyMeasurements(customer.id, measurementData);
      } else {
        // Personal user updating their own data
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          await BodyMeasurementService.createPersonalBodyMeasurements(userId, measurementData);
        }
      }
      
      setForm(prev => ({ ...prev, bodyMeasurements: measurements }));
      setHasBodyMeasurements(measurements.length > 0);
      setShowBodyMeasurementModal(false);
      Alert.alert('Thành công', 'Đã cập nhật số đo cơ thể');
    } catch (error) {
      console.error('Error updating body measurements:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật số đo cơ thể');
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
                placeholder="Địa chỉ"
                placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                value={form.address}
                onChangeText={(text) => setForm(prev => ({ ...prev, address: text }))}
              />

              {/* Gender Selection */}
              <View style={[styles.genderContainer, { 
                backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
              }]}>
                <Text style={[styles.genderLabel, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
                  Giới tính:
                </Text>
                <View style={styles.genderButtons}>
                  {[
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.genderButton,
                        {
                          backgroundColor: form.gender === option.value 
                            ? (isDarkMode ? Colors.darkGreen : Colors.darkGreen)
                            : 'transparent',
                          borderColor: isDarkMode ? Colors.darkSecondary : Colors.gray,
                        }
                      ]}
                      onPress={() => setForm(prev => ({ ...prev, gender: option.value }))}
                    >
                      <Text style={[
                        styles.genderButtonText,
                        {
                          color: form.gender === option.value 
                            ? Colors.white
                            : (isDarkMode ? Colors.darkText : Colors.black)
                        }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Chọn nhân viên phụ trách */}
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black,
                marginBottom: 12
              }]}>Nhân Viên Phụ Trách</Text>
              
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                    color: isDarkMode ? Colors.darkText : Colors.black,
                    borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                  }]}
                  placeholder="Tìm kiếm nhân viên theo tên..."
                  placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                  value={form.employeeSearch || ''}
                  onChangeText={handleEmployeeSearch}
                />
                
                {isSearchingEmployee && (
                  <ActivityIndicator 
                    size="small" 
                    color={Colors.darkGreen} 
                    style={styles.searchingIndicator}
                  />
                )}
              </View>

              {form.selectedEmployee && (
                <View style={[styles.selectedEmployeeCard, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : '#f0f9ff',
                  borderColor: Colors.darkGreen
                }]}>
                  <Text style={[styles.selectedEmployeeText, {
                    color: isDarkMode ? Colors.darkText : Colors.black
                  }]}>
                    ✓ {form.selectedEmployee.fullName} - {form.selectedEmployee.position}
                  </Text>
                  <TouchableOpacity onPress={() => setForm(prev => ({ ...prev, selectedEmployee: null, employeeSearch: '' }))}>
                    <Ionicons name="close-circle" size={20} color={Colors.darkGreen} />
                  </TouchableOpacity>
                </View>
              )}

              {employeeSearchResults.length > 0 && !form.selectedEmployee && (
                <View style={[styles.searchResults, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : 'white',
                  borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
                }]}>
                  <TouchableOpacity 
                    style={[styles.searchResultItem, styles.addNewEmployeeItem]}
                    onPress={() => {
                      Alert.alert('Thêm nhân viên', 'Chức năng thêm nhân viên mới sẽ được triển khai. Hiện tại vui lòng chọn từ danh sách có sẵn.');
                      setEmployeeSearchResults([]);
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={20} color={Colors.darkGreen} />
                    <Text style={[styles.addNewEmployeeText, { color: Colors.darkGreen }]}>
                      Thêm nhân viên mới
                    </Text>
                  </TouchableOpacity>
                  {employeeSearchResults.map((employee) => (
                    <TouchableOpacity 
                      key={employee.id}
                      style={styles.searchResultItem}
                      onPress={() => handleSelectEmployee(employee)}
                    >
                      <Avatar.Image 
                        size={30} 
                        source={{ uri: employee.avatar }}
                        style={{ marginRight: 8 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.resultEmployeeName, {
                          color: isDarkMode ? Colors.darkText : Colors.black
                        }]}>
                          {employee.fullName}
                        </Text>
                        <Text style={[styles.resultEmployeePosition, {
                          color: isDarkMode ? Colors.darkSecondary : Colors.gray
                        }]}>
                          {employee.position}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Thông tin thể chất - Show for all users, but only allow editing for matching userID */}
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>Thông Tin Thể Chất</Text>
                {canEditBodyData() && (
                  <Button
                    mode={hasNutritionData ? "outlined" : "contained"}
                    onPress={handleUpdateNutrition}
                    style={styles.sectionButton}
                    labelStyle={{ fontSize: 12 }}
                  >
                    {hasNutritionData ? "Cập nhật" : "Thêm"}
                  </Button>
                )}
                {!canEditBodyData() && customer && (
                  <Text style={[styles.readOnlyLabel, { 
                    color: isDarkMode ? Colors.darkSecondary : Colors.gray 
                  }]}>Chỉ khách hàng mới có thể chỉnh sửa</Text>
                )}
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
                        backgroundColor: canEditBodyData() ? (isDarkMode ? Colors.darkBackground : 'white') : (isDarkMode ? Colors.darkSecondary + '20' : '#f5f5f5'),
                        color: isDarkMode ? Colors.darkText : Colors.black,
                        borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb',
                        paddingTop: 18 // give space for label
                      }]}
                      placeholder=""
                      placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                      value={form.height}
                      onChangeText={(text) => setForm(prev => ({ ...prev, height: text }))}
                      keyboardType="numeric"
                      editable={canEditBodyData()}
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
                        backgroundColor: canEditBodyData() ? (isDarkMode ? Colors.darkBackground : 'white') : (isDarkMode ? Colors.darkSecondary + '20' : '#f5f5f5'),
                        color: isDarkMode ? Colors.darkText : Colors.black,
                        borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb',
                        paddingTop: 18
                      }]}
                      placeholder=""
                      placeholderTextColor={isDarkMode ? Colors.darkSecondary : Colors.gray}
                      value={form.weight}
                      onChangeText={(text) => setForm(prev => ({ ...prev, weight: text }))}
                      keyboardType="numeric"
                      editable={canEditBodyData()}
                    />
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Số đo cơ thể - Show for all users, but only allow editing for matching userID */}
          <Card style={[styles.formSection, { 
            backgroundColor: isDarkMode ? Colors.darkSurface : 'white',
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>Số Đo Cơ Thể</Text>
                {canEditBodyData() && (
                  <Button
                    mode={hasBodyMeasurements ? "outlined" : "contained"}
                    onPress={() => setShowBodyMeasurementModal(true)}
                    style={styles.sectionButton}
                    labelStyle={{ fontSize: 12 }}
                  >
                    {hasBodyMeasurements ? "Cập nhật" : "Thêm"}
                  </Button>
                )}
                {!canEditBodyData() && customer && (
                  <Text style={[styles.readOnlyLabel, { 
                    color: isDarkMode ? Colors.darkSecondary : Colors.gray 
                  }]}>Chỉ khách hàng mới có thể chỉnh sửa</Text>
                )}
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
              
              {!hasBodyMeasurements && !canEditBodyData() && customer && (
                <Text style={[styles.noDataText, { 
                  color: isDarkMode ? Colors.darkSecondary : Colors.gray 
                }]}>Chưa có dữ liệu số đo cơ thể</Text>
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
            canEdit={canEditBodyData()}
            onClose={() => setShowBodyMeasurementModal(false)}
            onSave={handleBodyMeasurementSave}
          />
        )}
      </View>
    </Modal>
  );
}

// Component modal số đo cơ thể
function BodyMeasurementModal({ visible, measurements, isDarkMode, canEdit = true, onClose, onSave }) {
  const [measurementList, setMeasurementList] = useState(measurements || []);
  const [newMeasurement, setNewMeasurement] = useState({ name: '', value: '' });

  const addMeasurement = () => {
    if (!canEdit) {
      Alert.alert('Không có quyền', 'Chỉ khách hàng mới có thể chỉnh sửa số đo cơ thể của chính mình');
      return;
    }
    
    if (!newMeasurement.name || !newMeasurement.value) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên bộ phận và số đo');
      return;
    }
    
    setMeasurementList(prev => [...prev, { ...newMeasurement }]);
    setNewMeasurement({ name: '', value: '' });
  };

  const removeMeasurement = (index) => {
    if (!canEdit) {
      Alert.alert('Không có quyền', 'Chỉ khách hàng mới có thể chỉnh sửa số đo cơ thể của chính mình');
      return;
    }
    
    setMeasurementList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!canEdit) {
      Alert.alert('Không có quyền', 'Chỉ khách hàng mới có thể chỉnh sửa số đo cơ thể của chính mình');
      return;
    }
    
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
          }]}>
            Số Đo Cơ Thể {!canEdit ? '(Chỉ xem)' : ''}
          </Text>
          {canEdit && (
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveButton, { color: Colors.darkGreen }]}>Lưu</Text>
            </TouchableOpacity>
          )}
          {!canEdit && (
            <View style={{ width: 40 }} />
          )}
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Form thêm số đo mới - Only show if user can edit */}
          {canEdit && (
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
          )}

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
                    {canEdit && (
                      <TouchableOpacity 
                        onPress={() => removeMeasurement(index)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    )}
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
  customerCard: {
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  customerMeta: {
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
  selectedEmployeeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  selectedEmployeeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchResults: {
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addNewEmployeeItem: {
    backgroundColor: '#f0f9ff',
  },
  addNewEmployeeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  resultEmployeeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultEmployeePosition: {
    fontSize: 12,
  },
  readOnlyLabel: {
    fontSize: 11,
    fontStyle: 'italic',
    paddingHorizontal: 6,
    paddingVertical: 4,
    textAlign: 'center',
    maxWidth: 120,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  genderContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
  },
  genderLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '500',
  }
});