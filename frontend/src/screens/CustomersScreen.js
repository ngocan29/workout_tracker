import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Card, FAB, Avatar, Searchbar, DataTable } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import CustomerFormModal from '../components/CustomerFormModal';
import { getCustomersByBranch, getCustomersByEmployee, deleteCustomer } from '../services/customerApi';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function CustomersScreen({ isDarkMode, userRole = 'business' }) {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      loadCustomers();
    }
  }, [userData, userRole]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const loadUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      if (user) {
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadCustomers = async () => {
    if (!userData) return;
    
    try {
      setLoading(true);
      let customersData = [];
      
      // Xác định chi nhánh hiện tại
      const currentBranchId = userData.additional_info?.chinhanhID || userData.chinhanhID;
      
      if (!currentBranchId) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin chi nhánh');
        return;
      }

      // TH1: Business - lấy tất cả khách hàng trong chi nhánh
      if (userData.loai_tai_khoan === 'business' || userRole === 'business') {
        customersData = await getCustomersByBranch(currentBranchId);
      }
      // TH2: Nhân viên - chỉ lấy khách hàng được phân công
      else if (userData.additional_info?.vai_tro === 'nhanvien' || userRole === 'nhanvien') {
        customersData = await getCustomersByEmployee(userData._id, currentBranchId);
      }

      // Transform data để phù hợp với UI
      const transformedCustomers = customersData.map(customer => ({
        id: customer._id,
        fullName: customer.ten,
        email: customer.email,
        phone: customer.sodienthoai || 'Chưa có',
        address: customer.diachi || 'Chưa có địa chỉ',
        avatar: customer.hinhanh || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.ten)}&background=random`,
        joinDate: new Date(customer.ngayvao || customer.additional_info?.ngaydangky).toLocaleDateString('vi-VN'),
        assignedEmployee: customer.additional_info?.nhanvienUserID || null,
        rawData: customer
      }));

      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách khách hàng');
      // Fallback to empty data if API fails
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setShowAddModal(true);
  };

  const handleEditCustomer = (customer) => {
    console.log('handleEditCustomer called with:', customer);
    // Truyền rawData thay vì transformed data để CustomerFormModal có đầy đủ thông tin
    setSelectedCustomer(customer.rawData || customer);
    setShowAddModal(true);
  };

  const handleDeleteCustomer = (customerId) => {
    console.log('handleDeleteCustomer called with ID:', customerId);
    
    // Sử dụng window.confirm cho web platform
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?');
    
    if (confirmed) {
      executeDelete(customerId);
    }
  };

  const executeDelete = async (customerId) => {
    console.log('User confirmed delete for customer ID:', customerId);
    try {
      const result = await deleteCustomer(customerId);
      console.log('Delete result:', result);
      if (result.success) {
        // Reload customer list after successful deletion
        await loadCustomers();
        
        // Hiển thị thông báo thành công
        window.alert('Thành công: ' + (result.message || 'Xóa khách hàng thành công'));
      } else {
        throw new Error(result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      
      // Hiển thị thông báo lỗi
      window.alert('Lỗi: ' + (error.message || 'Có lỗi xảy ra khi xóa khách hàng'));
    }
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
              {/* Hiển thị mã nhân viên phụ trách nếu có */}
              {item.assignedEmployee && (
                <Text style={[styles.assignedEmployee, { 
                  color: isDarkMode ? Colors.darkGreen : Colors.darkGreen 
                }]}>👨‍💼 NV: {item.assignedEmployee}</Text>
              )}
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity 
              onPress={() => handleEditCustomer(item)}
              style={[styles.actionButton, styles.editButton]}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color={Colors.darkGreen} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDeleteCustomer(item.id || item._id)}
              style={[styles.actionButton, styles.deleteButton]}
              activeOpacity={0.7}
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
                <View>
                  <Text style={[styles.tableUserName, { 
                    color: isDarkMode ? Colors.darkText : Colors.black 
                  }]}>{customer.fullName}</Text>
                  {customer.assignedEmployee && (
                    <Text style={[styles.tableAssignedEmployee, { 
                      color: isDarkMode ? Colors.darkGreen : Colors.darkGreen 
                    }]}>NV: {customer.assignedEmployee}</Text>
                  )}
                </View>
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
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={16} color={Colors.darkGreen} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDeleteCustomer(customer.id || customer._id)}
                  style={[styles.tableActionButton, { backgroundColor: '#ef444420' }]}
                  activeOpacity={0.7}
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

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { 
        backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb' 
      }]}>
        <Text style={{ color: isDarkMode ? Colors.darkText : Colors.black }}>
          Đang tải danh sách khách hàng...
        </Text>
      </View>
    );
  }

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
        }]}>
          Tổng: {filteredCustomers.length} khách hàng
          {userRole === 'nhanvien' && ' (được phân công)'}
        </Text>
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
        {isTablet ? renderTableView() : (
          <FlatList
            data={filteredCustomers}
            renderItem={renderCustomerCard}
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
        onPress={handleAddCustomer}
        color="white"
      />

      {/* Customer Form Modal */}
      {showAddModal && (
        <CustomerFormModal
          visible={showAddModal}
          customer={selectedCustomer}
          isDarkMode={isDarkMode}
          onClose={() => setShowAddModal(false)}
          onSave={(customerData) => {
            // Handle save customer logic
            console.log('Save customer data:', customerData);
            setShowAddModal(false);
            // Refresh customer list after save
            loadCustomers();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  assignedEmployee: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    marginLeft: 4,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  editButton: {
    backgroundColor: Colors.darkGreen + '15',
  },
  deleteButton: {
    backgroundColor: '#ef444415',
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
  tableAssignedEmployee: {
    fontSize: 10,
    fontWeight: '500',
  },
  tableActions: {
    flexDirection: 'row',
    gap: 4,
  },
  tableActionButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});