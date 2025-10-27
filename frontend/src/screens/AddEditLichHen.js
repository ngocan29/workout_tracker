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
  Platform,
  TextInput as RNTextInput,
} from 'react-native';
import { 
  TextInput, 
  Card, 
  Avatar,
  Chip
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../constants/Colors';
import AddKhachHang from './AddKhachHang';

export default function AddEditLichHen({ 
  visible, 
  appointment = null, 
  isDarkMode, 
  onClose, 
  onSave 
}) {
  const [form, setForm] = useState({
    khachhangUserID: null,
    khachhangInfo: null, // Thông tin khách hàng để hiển thị
    ngayhen: new Date(),
    ghichu: '',
    trangthai: 'chuaxacnhan',
    diadiem: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  // Mock data khách hàng mà nhân viên phụ trách
  const mockCustomers = [
    {
      id: 1,
      fullName: 'Nguyễn Văn An',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNkZGRkZGQiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyMCIgcj0iOCIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNNDAgNDBDNDAgMzMuMzcyNiAzMy42Mjc0IDI4IDI1IDI4QzE2LjM3MjYgMjggMTAgMzMuMzcyNiAxMCA0MEg0MFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+',
      assignedTo: 'current_user' // Giả sử đây là nhân viên hiện tại
    },
    {
      id: 3,
      fullName: 'Lê Văn Cường',
      email: 'levanc@example.com',
      phone: '0912345678',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNkZGRkZGQiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyMCIgcj0iOCIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNNDAgNDBDNDAgMzMuMzcyNiAzMy42Mjc0IDI4IDI1IDI4QzE2LjM3MjYgMjggMTAgMzMuMzcyNiAxMCA0MEg0MFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+',
      assignedTo: 'current_user'
    }
  ];

  const statusOptions = [
    { value: 'chuaxacnhan', label: 'Chưa xác nhận', color: '#f59e0b' },
    { value: 'daxacnhan', label: 'Đã xác nhận', color: '#10b981' },
    { value: 'dahuy', label: 'Đã hủy', color: '#ef4444' },
    { value: 'hoanthanh', label: 'Hoàn thành', color: '#6366f1' }
  ];

  const locationOptions = [
    'Phòng tập 1',
    'Phòng tập 2', 
    'Phòng Yoga',
    'Phòng Cardio',
    'Sân tennis',
    'Hồ bơi'
  ];

  const loadCustomers = () => {
    try {
      // Trong ứng dụng thực tế, sẽ gọi API để lấy danh sách khách hàng mà nhân viên phụ trách
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách khách hàng');
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (appointment) {
      // Nếu chỉnh sửa lịch hẹn có sẵn
      const appointmentDate = new Date(appointment.ngayhen || appointment.date);
      setForm({
        khachhangUserID: appointment.khachhangUserID,
        khachhangInfo: appointment.customerInfo,
        ngayhen: appointmentDate,
        ghichu: appointment.ghichu || appointment.notes || '',
        trangthai: appointment.trangthai || appointment.status || 'chuaxacnhan',
        diadiem: appointment.diadiem || appointment.location || ''
      });
      
      setSelectedDate(appointmentDate);
      setSelectedTime(appointmentDate);
    } else {
      // Nếu thêm mới, set thời gian mặc định là 1 giờ sau hiện tại
      const defaultTime = new Date();
      defaultTime.setHours(defaultTime.getHours() + 1);
      defaultTime.setMinutes(0);
      defaultTime.setSeconds(0);
      defaultTime.setMilliseconds(0);
      
      setSelectedDate(defaultTime);
      setSelectedTime(defaultTime);
      setForm(prev => ({ ...prev, ngayhen: defaultTime }));
    }
  }, [appointment]);

  const handleDateChange = (event, newDate) => {
    console.log('handleDateChange called:', { event, newDate });
    setShowDatePicker(false);
    if (newDate) {
      setSelectedDate(newDate);
      // Kết hợp ngày mới với giờ hiện tại
      const newDateTime = new Date(newDate);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      newDateTime.setSeconds(0);
      newDateTime.setMilliseconds(0);
      console.log('New combined date time:', newDateTime);
      setForm(prev => ({ ...prev, ngayhen: newDateTime }));
    }
  };

  const handleTimeChange = (event, newTime) => {
    console.log('handleTimeChange called:', { event, newTime });
    setShowTimePicker(false);
    if (newTime) {
      setSelectedTime(newTime);
      // Kết hợp giờ mới với ngày hiện tại
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(newTime.getHours());
      newDateTime.setMinutes(newTime.getMinutes());
      newDateTime.setSeconds(0);
      newDateTime.setMilliseconds(0);
      console.log('New combined date time:', newDateTime);
      setForm(prev => ({ ...prev, ngayhen: newDateTime }));
    }
  };

  const handleCustomerSelect = (customer) => {
    setForm(prev => ({
      ...prev,
      khachhangUserID: customer.id,
      khachhangInfo: customer
    }));
    setShowCustomerModal(false);
  };

  const handleAddNewCustomer = () => {
    setShowCustomerModal(false);
    setShowAddCustomerModal(true);
  };

  const handleSaveNewCustomer = (customerData) => {
    // Thêm khách hàng mới vào danh sách
    setCustomers(prev => [...prev, customerData]);
    
    // Tự động chọn khách hàng vừa thêm
    setForm(prev => ({
      ...prev,
      khachhangUserID: customerData.id,
      khachhangInfo: customerData
    }));
    
    Alert.alert('Thành công', 'Đã thêm khách hàng mới');
  };

  const validateForm = () => {
    if (!form.khachhangUserID) {
      Alert.alert('Lỗi', 'Vui lòng chọn khách hàng');
      return false;
    }
    if (!form.ngayhen) {
      Alert.alert('Lỗi', 'Vui lòng chọn ngày hẹn');
      return false;
    }
    if (!form.diadiem.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa điểm');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const appointmentData = {
      ...form,
      ngaytao: new Date(), // Ngày tạo là hiện tại
      nhanvienUserID: 'current_user_id' // TODO: Lấy từ context người dùng hiện tại
    };

    onSave(appointmentData);
    onClose();
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : '#6b7280';
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : 'Không xác định';
  };

  const DateTimeInput = ({ type, value, onChange, isDarkMode }) => {
    if (Platform.OS === 'web') {
      const handleWebChange = (event) => {
        const newValue = event.target.value;
        if (newValue) {
          const newDate = new Date(newValue);
          onChange(null, newDate);
        }
      };

      const formatForWeb = (date) => {
        if (type === 'date') {
          return date.toISOString().split('T')[0];
        } else {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      };

      return (
        <RNTextInput
          type={type}
          value={formatForWeb(value)}
          onChange={handleWebChange}
          style={[styles.webDateTimeInput, {
            backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb',
            borderColor: isDarkMode ? Colors.darkSecondary : '#d1d5db',
            color: isDarkMode ? Colors.darkText : Colors.black
          }]}
          min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
        />
      );
    }

    return (
      <TouchableOpacity
        style={[styles.dateTimeButtonFull, {
          backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb',
          borderColor: isDarkMode ? Colors.darkSecondary : '#d1d5db'
        }]}
        onPress={() => {
          if (type === 'date') {
            console.log('Date picker clicked, selectedDate:', value);
            setShowDatePicker(true);
          } else {
            console.log('Time picker clicked, selectedTime:', value);
            setShowTimePicker(true);
          }
        }}
      >
        <Ionicons 
          name={type === 'date' ? "calendar-outline" : "time-outline"} 
          size={20} 
          color={isDarkMode ? Colors.darkSecondary : Colors.gray} 
        />
        <Text style={[styles.dateTimeTextFull, { 
          color: isDarkMode ? Colors.darkText : Colors.black 
        }]}>
          {type === 'date' ? formatDate(value) : formatTime(value)}
        </Text>
      </TouchableOpacity>
    );
  };

  const CustomerSelectionModal = () => (
    <Modal
      visible={showCustomerModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.modalContainer, { 
        backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background 
      }]}>
        <View style={[styles.modalHeader, { 
          backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
          borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
        }]}>
          <Text style={[styles.modalTitle, { 
            color: isDarkMode ? Colors.darkText : Colors.black 
          }]}>
            Chọn Khách Hàng
          </Text>
          <TouchableOpacity onPress={() => setShowCustomerModal(false)}>
            <Ionicons 
              name="close" 
              size={24} 
              color={isDarkMode ? Colors.darkText : Colors.black} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.customerList}>
          {/* Nút thêm khách hàng mới */}
          <TouchableOpacity
            style={[styles.addCustomerButton, {
              backgroundColor: Colors.darkGreen + '20',
              borderColor: Colors.darkGreen
            }]}
            onPress={handleAddNewCustomer}
          >
            <View style={styles.addCustomerContent}>
              <View style={[styles.addCustomerIcon, { backgroundColor: Colors.darkGreen }]}>
                <Ionicons name="add" size={24} color="white" />
              </View>
              <Text style={[styles.addCustomerText, { color: Colors.darkGreen }]}>
                Thêm khách hàng mới
              </Text>
            </View>
          </TouchableOpacity>

          {/* Danh sách khách hàng */}
          {customers.map((customer) => (
            <TouchableOpacity
              key={customer.id}
              style={[styles.customerItem, {
                backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
              }]}
              onPress={() => handleCustomerSelect(customer)}
            >
              <Avatar.Image size={50} source={{ uri: customer.avatar }} />
              <View style={styles.customerInfo}>
                <Text style={[styles.customerName, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>
                  {customer.fullName}
                </Text>
                <Text style={[styles.customerEmail, { 
                  color: isDarkMode ? Colors.darkSecondary : Colors.gray 
                }]}>
                  {customer.email}
                </Text>
                <Text style={[styles.customerPhone, { 
                  color: isDarkMode ? Colors.darkSecondary : Colors.gray 
                }]}>
                  {customer.phone}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDarkMode ? Colors.darkSecondary : Colors.gray} 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

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
            {appointment ? 'Chỉnh Sửa Lịch Hẹn' : 'Thêm Lịch Hẹn Mới'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: Colors.darkGreen }]}>
              Lưu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Chọn khách hàng */}
          <Card style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Khách Hàng
              </Text>
              
              <TouchableOpacity
                style={[styles.customerSelector, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb',
                  borderColor: isDarkMode ? Colors.darkSecondary : '#d1d5db'
                }]}
                onPress={() => setShowCustomerModal(true)}
              >
                {form.khachhangInfo ? (
                  <View style={styles.selectedCustomer}>
                    <Avatar.Image size={40} source={{ uri: form.khachhangInfo.avatar }} />
                    <View style={styles.selectedCustomerInfo}>
                      <Text style={[styles.selectedCustomerName, { 
                        color: isDarkMode ? Colors.darkText : Colors.black 
                      }]}>
                        {form.khachhangInfo.fullName}
                      </Text>
                      <Text style={[styles.selectedCustomerEmail, { 
                        color: isDarkMode ? Colors.darkSecondary : Colors.gray 
                      }]}>
                        {form.khachhangInfo.email}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.placeholderCustomer}>
                    <Ionicons 
                      name="person-add-outline" 
                      size={24} 
                      color={isDarkMode ? Colors.darkSecondary : Colors.gray} 
                    />
                    <Text style={[styles.placeholderText, { 
                      color: isDarkMode ? Colors.darkSecondary : Colors.gray 
                    }]}>
                      Chọn khách hàng
                    </Text>
                  </View>
                )}
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={isDarkMode ? Colors.darkSecondary : Colors.gray} 
                />
              </TouchableOpacity>
            </Card.Content>
          </Card>

          {/* Ngày và giờ hẹn */}
          <Card style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Thời Gian
              </Text>
              
              <View style={styles.dateTimeColumn}>
                <Text style={[styles.fieldLabel, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>
                  Ngày hẹn
                </Text>
                <DateTimeInput
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  isDarkMode={isDarkMode}
                />

                <Text style={[styles.fieldLabel, { 
                  color: isDarkMode ? Colors.darkText : Colors.black 
                }]}>
                  Giờ hẹn
                </Text>
                <DateTimeInput
                  type="time"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  isDarkMode={isDarkMode}
                />
              </View>
            </Card.Content>
          </Card>

          {/* Địa điểm */}
          <Card style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Địa Điểm
              </Text>
              
              <View style={styles.locationOptions}>
                {locationOptions.map((location, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setForm(prev => ({ ...prev, diadiem: location }))}
                  >
                    <Chip
                      selected={form.diadiem === location}
                      style={[styles.locationChip, {
                        backgroundColor: form.diadiem === location 
                          ? Colors.darkGreen 
                          : (isDarkMode ? Colors.darkBackground : '#f3f4f6')
                      }]}
                      textStyle={{
                        color: form.diadiem === location 
                          ? 'white' 
                          : (isDarkMode ? Colors.darkText : Colors.black)
                      }}
                    >
                      {location}
                    </Chip>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                label="Hoặc nhập địa điểm khác"
                value={form.diadiem}
                onChangeText={(text) => setForm(prev => ({ ...prev, diadiem: text }))}
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

          {/* Trạng thái */}
          <Card style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Trạng Thái
              </Text>
              
              <TouchableOpacity
                style={[styles.statusSelector, {
                  backgroundColor: isDarkMode ? Colors.darkBackground : '#f9fafb',
                  borderColor: isDarkMode ? Colors.darkSecondary : '#d1d5db'
                }]}
                onPress={() => setShowStatusMenu(!showStatusMenu)}
              >
                <View style={styles.statusContent}>
                  <View style={[styles.statusDot, { 
                    backgroundColor: getStatusColor(form.trangthai) 
                  }]} />
                  <Text style={[styles.statusText, { 
                    color: isDarkMode ? Colors.darkText : Colors.black 
                  }]}>
                    {getStatusLabel(form.trangthai)}
                  </Text>
                </View>
                <Ionicons 
                  name={showStatusMenu ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={isDarkMode ? Colors.darkSecondary : Colors.gray} 
                />
              </TouchableOpacity>

              {/* Status Options Dropdown */}
              {showStatusMenu && (
                <View style={[styles.statusDropdown, {
                  backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
                  borderColor: isDarkMode ? Colors.darkSecondary : '#d1d5db'
                }]}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.statusOption, {
                        backgroundColor: form.trangthai === option.value 
                          ? (isDarkMode ? Colors.darkBackground : '#f3f4f6')
                          : 'transparent'
                      }]}
                      onPress={() => {
                        setForm(prev => ({ ...prev, trangthai: option.value }));
                        setShowStatusMenu(false);
                      }}
                    >
                      <View style={styles.statusContent}>
                        <View style={[styles.statusDot, { backgroundColor: option.color }]} />
                        <Text style={[styles.statusOptionText, {
                          color: isDarkMode ? Colors.darkText : Colors.black
                        }]}>
                          {option.label}
                        </Text>
                      </View>
                      {form.trangthai === option.value && (
                        <Ionicons 
                          name="checkmark" 
                          size={20} 
                          color={Colors.darkGreen} 
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Ghi chú */}
          <Card style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
            borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
          }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                Ghi Chú
              </Text>
              
              <TextInput
                label="Ghi chú về buổi tập hoặc yêu cầu đặc biệt"
                value={form.ghichu}
                onChangeText={(text) => setForm(prev => ({ ...prev, ghichu: text }))}
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

        {/* Date/Time Pickers - Only for mobile */}
        {Platform.OS !== 'web' && showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
            locale="vi-VN"
            style={{ backgroundColor: 'white' }}
          />
        )}

        {Platform.OS !== 'web' && showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
            is24Hour={true}
            locale="vi-VN"
            style={{ backgroundColor: 'white' }}
          />
        )}

        {/* Customer Selection Modal */}
        <CustomerSelectionModal />

        {/* Add Customer Modal */}
        <AddKhachHang
          visible={showAddCustomerModal}
          isDarkMode={isDarkMode}
          onClose={() => setShowAddCustomerModal(false)}
          onSave={handleSaveNewCustomer}
        />
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
    marginBottom: 12,
  },
  customerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedCustomerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  selectedCustomerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedCustomerEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  placeholderCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    marginLeft: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeColumn: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 8,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateTimeButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  webDateTimeInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 8,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, sans-serif' : undefined,
  },
  dateTimeText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  dateTimeTextFull: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  locationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  locationChip: {
    marginBottom: 4,
  },
  input: {
    marginTop: 8,
  },
  statusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
  },
  statusDropdown: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statusOptionText: {
    fontSize: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textArea: {
    marginTop: 8,
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
  customerList: {
    flex: 1,
    padding: 16,
  },
  addCustomerButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  addCustomerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCustomerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addCustomerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
  },
});