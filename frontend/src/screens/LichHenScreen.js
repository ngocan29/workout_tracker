import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Card, Button, Avatar, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/ui/Navbar';
import { Colors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddEditLichHen from './AddEditLichHen';

export default function LichHenScreen({ isDarkMode, setDarkMode }) {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all'); // all, today, upcoming, completed

  // Mock data for appointments
  const mockAppointments = [
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      customerAvatar: 'https://via.placeholder.com/50',
      date: new Date(2025, 9, 27, 9, 0), // Oct 27, 2025, 9:00 AM
      status: 'daxacnhan',
      service: 'Personal Training',
      notes: 'Tập luyện cơ bản, focus vào cardio',
      location: 'Phòng tập 1',
      phone: '0901234567',
    },
    {
      id: 2,
      customerName: 'Trần Thị B',
      customerAvatar: 'https://via.placeholder.com/50',
      date: new Date(2025, 9, 27, 14, 30), // Oct 27, 2025, 2:30 PM
      status: 'chualichhen',
      service: 'Yoga Session',
      notes: 'Yoga cho người mới bắt đầu',
      location: 'Phòng Yoga',
      phone: '0987654321',
    },
    {
      id: 3,
      customerName: 'Lê Văn C',
      customerAvatar: 'https://via.placeholder.com/50',
      date: new Date(2025, 9, 28, 10, 0), // Oct 28, 2025, 10:00 AM
      status: 'hoanthanh',
      service: 'Weight Training',
      notes: 'Tập tạ nâng cao',
      location: 'Phòng tập 2',
      phone: '0912345678',
    },
  ];

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, currentFilter]);

  const loadAppointments = () => {
    try {
      // In real app, this would be an API call
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách lịch hẹn');
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (currentFilter) {
      case 'today':
        filtered = appointments.filter(apt => {
          const aptDate = new Date(apt.date);
          aptDate.setHours(0, 0, 0, 0);
          return aptDate.getTime() === today.getTime();
        });
        break;
      case 'upcoming':
        filtered = appointments.filter(apt => 
          new Date(apt.date) > new Date() && apt.status !== 'hoanthanh'
        );
        break;
      case 'completed':
        filtered = appointments.filter(apt => apt.status === 'hoanthanh');
        break;
      default:
        break;
    }

    setFilteredAppointments(filtered.sort((a, b) => new Date(a.date) - new Date(b.date)));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAppointments();
    setRefreshing(false);
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setShowAddModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAddModal(true);
  };

  const handleSaveAppointment = (appointmentData) => {
    if (selectedAppointment) {
      // Chỉnh sửa lịch hẹn có sẵn
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, ...appointmentData, id: selectedAppointment.id }
            : apt
        )
      );
      Alert.alert('Thành công', 'Đã cập nhật lịch hẹn');
    } else {
      // Thêm lịch hẹn mới
      const newAppointment = {
        ...appointmentData,
        id: appointments.length + 1,
        customerName: appointmentData.khachhangInfo?.fullName || 'Khách hàng',
        customerAvatar: appointmentData.khachhangInfo?.avatar || 'https://via.placeholder.com/50',
        date: appointmentData.ngayhen,
        status: appointmentData.trangthai,
        service: 'Personal Training', // Default service
        notes: appointmentData.ghichu,
        location: appointmentData.diadiem,
        phone: appointmentData.khachhangInfo?.phone || ''
      };
      setAppointments(prev => [...prev, newAppointment]);
      Alert.alert('Thành công', 'Đã thêm lịch hẹn mới');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'daxacnhan': return '#10b981';
      case 'chualichhen': return '#f59e0b';
      case 'dahuy': return '#ef4444';
      case 'hoanthanh': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'daxacnhan': return 'Đã xác nhận';
      case 'chualichhen': return 'Chưa xác nhận';
      case 'dahuy': return 'Đã hủy';
      case 'hoanthanh': return 'Hoàn thành';
      default: return 'Không xác định';
    }
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus }
          : apt
      )
    );
    Alert.alert('Thành công', 'Đã cập nhật trạng thái lịch hẹn');
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const FilterButton = ({ filter, title, count }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        currentFilter === filter && styles.activeFilterButton,
        { 
          backgroundColor: currentFilter === filter 
            ? (isDarkMode ? Colors.darkGreen : Colors.darkGreen)
            : (isDarkMode ? Colors.darkSurface : Colors.white),
          borderColor: isDarkMode ? Colors.darkSecondary : '#e5e7eb'
        }
      ]}
      onPress={() => setCurrentFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        currentFilter === filter && styles.activeFilterButtonText,
        { color: currentFilter === filter 
          ? Colors.white 
          : (isDarkMode ? Colors.darkText : Colors.black)
        }
      ]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={[
          styles.countBadge,
          { backgroundColor: currentFilter === filter ? Colors.white : Colors.darkGreen }
        ]}>
          <Text style={[
            styles.countText,
            { color: currentFilter === filter ? Colors.darkGreen : Colors.white }
          ]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderAppointmentCard = (appointment) => (
    <Card key={appointment.id} style={[styles.appointmentCard, {
      backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
      borderColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
    }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.customerInfo}>
            <Avatar.Image 
              size={50} 
              source={{ uri: appointment.customerAvatar }}
              style={styles.avatar}
            />
            <View style={styles.customerDetails}>
              <Text style={[styles.customerName, { 
                color: isDarkMode ? Colors.darkText : Colors.black 
              }]}>
                {appointment.customerName}
              </Text>
              <Text style={[styles.appointmentDate, { 
                color: isDarkMode ? Colors.darkSecondary : Colors.gray 
              }]}>
                {formatDate(appointment.date)}
              </Text>
              <Text style={[styles.serviceType, { 
                color: isDarkMode ? Colors.darkSecondary : Colors.gray 
              }]}>
                {appointment.service}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
            <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={isDarkMode ? Colors.darkSecondary : Colors.gray} />
            <Text style={[styles.detailText, { color: isDarkMode ? Colors.darkSecondary : Colors.gray }]}>
              {appointment.location}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={16} color={isDarkMode ? Colors.darkSecondary : Colors.gray} />
            <Text style={[styles.detailText, { color: isDarkMode ? Colors.darkSecondary : Colors.gray }]}>
              {appointment.phone}
            </Text>
          </View>
          {appointment.notes && (
            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={16} color={isDarkMode ? Colors.darkSecondary : Colors.gray} />
              <Text style={[styles.detailText, { color: isDarkMode ? Colors.darkSecondary : Colors.gray }]}>
                {appointment.notes}
              </Text>
            </View>
          )}
        </View>

        {appointment.status !== 'hoanthanh' && appointment.status !== 'dahuy' && (
          <View style={styles.actionButtons}>
            {appointment.status === 'chualichhen' && (
              <Button
                mode="contained"
                style={[styles.actionButton, { backgroundColor: Colors.darkGreen }]}
                onPress={() => updateAppointmentStatus(appointment.id, 'daxacnhan')}
              >
                Xác nhận
              </Button>
            )}
            {appointment.status === 'daxacnhan' && (
              <Button
                mode="contained"
                style={[styles.actionButton, { backgroundColor: '#6366f1' }]}
                onPress={() => updateAppointmentStatus(appointment.id, 'hoanthanh')}
              >
                Hoàn thành
              </Button>
            )}
            <Button
              mode="outlined"
              style={[styles.actionButton, { borderColor: '#ef4444' }]}
              labelStyle={{ color: '#ef4444' }}
              onPress={() => updateAppointmentStatus(appointment.id, 'dahuy')}
            >
              Hủy
            </Button>
            <Button
              mode="outlined"
              style={[styles.actionButton, { borderColor: Colors.darkGreen }]}
              labelStyle={{ color: Colors.darkGreen }}
              onPress={() => handleEditAppointment(appointment)}
            >
              Sửa
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? Colors.darkSurface : Colors.white,
        borderBottomColor: isDarkMode ? Colors.darkBackground : '#e5e7eb'
      }]}>
        <Text style={[styles.headerTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
          Lịch Hẹn
        </Text>
        <Text style={[styles.headerSubtitle, { color: isDarkMode ? Colors.darkSecondary : Colors.gray }]}>
          Quản lý lịch hẹn với khách hàng
        </Text>
      </View>

      {/* Filter Buttons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <FilterButton 
          filter="all" 
          title="Tất cả" 
          count={appointments.length}
        />
        <FilterButton 
          filter="today" 
          title="Hôm nay" 
          count={appointments.filter(apt => {
            const today = new Date();
            const aptDate = new Date(apt.date);
            return today.toDateString() === aptDate.toDateString();
          }).length}
        />
        <FilterButton 
          filter="upcoming" 
          title="Sắp tới" 
          count={appointments.filter(apt => 
            new Date(apt.date) > new Date() && apt.status !== 'hoanthanh'
          ).length}
        />
        <FilterButton 
          filter="completed" 
          title="Hoàn thành" 
          count={appointments.filter(apt => apt.status === 'hoanthanh').length}
        />
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(renderAppointmentCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons 
              name="calendar-outline" 
              size={64} 
              color={isDarkMode ? Colors.darkSecondary : Colors.gray} 
            />
            <Text style={[styles.emptyText, { color: isDarkMode ? Colors.darkSecondary : Colors.gray }]}>
              Không có lịch hẹn nào
            </Text>
            <Text style={[styles.emptySubtext, { color: isDarkMode ? Colors.darkSecondary : Colors.gray }]}>
              {currentFilter === 'all' 
                ? 'Chưa có lịch hẹn nào được tạo'
                : `Không có lịch hẹn ${currentFilter === 'today' ? 'hôm nay' : 
                  currentFilter === 'upcoming' ? 'sắp tới' : 'hoàn thành'}`
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB to add new appointment */}
      <FAB
        style={[styles.fab, { backgroundColor: Colors.darkGreen }]}
        icon="plus"
        onPress={handleAddAppointment}
      />

      {/* Add/Edit Appointment Modal */}
      <AddEditLichHen
        visible={showAddModal}
        appointment={selectedAppointment}
        isDarkMode={isDarkMode}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveAppointment}
      />
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
  filterContainer: {
    paddingVertical: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  activeFilterButton: {
    borderWidth: 0,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    fontWeight: '600',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  appointmentCard: {
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  appointmentDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentDetails: {
    marginBottom: 12,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});