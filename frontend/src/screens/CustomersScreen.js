import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Card, FAB, Avatar, Searchbar, DataTable } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import CustomerFormModal from '../components/CustomerFormModal';

const { width } = Dimensions.get('window');
const isTablet = width > 768;
// Business thì hiện đầy đủ khách hàng của chinhanh (nếu Khách hàng có Nhân viên phụ trách thì trên thẻ hiển thị mã nhân viên phụ trách nữa) còn NhanVien chỉ hiển thị khách hàng của mình
export default function CustomersScreen({ isDarkMode, userRole = 'business' }) {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, [userRole]);

  const loadCustomers = () => {
    // Sample data - replace with API calls
    const allCustomers = [
      {
        id: '1',
        fullName: 'Nguyễn Văn An',
        email: 'nguyenvanan@gmail.com',
        phone: '0901234567',
        address: '123 Lê Lợi, Q1, HCM',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=random',
        joinDate: '2024-01-15',
        status: 'active',
        assignedEmployee: 'NV001', // Mã nhân viên phụ trách
        employeeName: 'Phạm Thành Đạt'
      },
      {
        id: '2', 
        fullName: 'Trần Thị Bình',
        email: 'tranthibinh@gmail.com',
        phone: '0907654321',
        address: '456 Nguyễn Huệ, Q1, HCM',
        avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=random',
        joinDate: '2024-02-20',
        status: 'active',
        assignedEmployee: 'NV002', // Mã nhân viên phụ trách
        employeeName: 'Lê Thị Mai'
      },
      {
        id: '3',
        fullName: 'Lê Văn Cường',
        email: 'levancuong@gmail.com',
        phone: '0912345678',
        address: '789 Võ Văn Tần, Q3, HCM',
        avatar: 'https://ui-avatars.com/api/?name=Le+Van+Cuong&background=random',
        joinDate: '2024-03-10',
        status: 'active',
        assignedEmployee: 'NV001', // Cùng nhân viên với khách hàng đầu
        employeeName: 'Phạm Thành Đạt'
      },
    ];

    // Filter customers based on user role
    let filteredData = allCustomers;
    if (userRole === 'nhanvien') {
      // NhanVien chỉ hiển thị khách hàng của mình
      // In real app, this would filter by current employee ID
      filteredData = allCustomers.filter(customer => customer.assignedEmployee === 'NV001');
    }
    // Business thì hiện đầy đủ khách hàng của chinhanh

    setCustomers(filteredData);
  };

  useEffect(() => {
    loadCustomers();
  }, [userRole]);

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

  const handleDeleteCustomer = (customerId) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa khách hàng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => {
            setCustomers(prev => prev.filter(c => c.id !== customerId));
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
          onSave={(customerData) => {
            if (selectedCustomer) {
              // Update existing customer
              setCustomers(prev => 
                prev.map(c => c.id === selectedCustomer.id ? { ...c, ...customerData } : c)
              );
            } else {
              // Add new customer
              const newCustomer = {
                id: Date.now().toString(),
                ...customerData,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerData.fullName)}&background=random`,
                joinDate: new Date().toLocaleDateString('vi-VN'),
                status: 'active'
              };
              setCustomers(prev => [newCustomer, ...prev]);
            }
            setShowAddModal(false);
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
});