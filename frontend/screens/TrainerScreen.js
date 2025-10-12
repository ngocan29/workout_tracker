import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ArrowLeft, MessageCircle, Phone, Video } from 'react-native-feather';
import { trainerData } from '../app-example/constants/Data';
import Colors from '../app-example/constants/Colors';

export default function TrainerScreen({ setCurrentScreen }) {
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('main')}>
          <ArrowLeft stroke={Colors.text} width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Huấn Luyện Viên</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <MessageCircle stroke={Colors.text} width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Phone stroke={Colors.text} width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.profileCard}>
        <Image source={{ uri: trainerData.avatar }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{trainerData.name}</Text>
          <Text style={styles.title}>{trainerData.title}</Text>
          <View style={styles.stats}>
            <Text style={[styles.stat, { color: Colors.warning }]}>{trainerData.rating} ★</Text>
            <Text style={styles.stat}>{trainerData.experience} năm</Text>
            <Text style={styles.stat}>{trainerData.students} học viên</Text>
          </View>
        </View>
      </View>
      <View style={styles.specialties}>
        {trainerData.specialties.map((specialty, index) => (
          <Text key={index} style={styles.specialtyTag}>{specialty}</Text>
        ))}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle stroke={Colors.white} width={20} height={20} />
          <Text style={styles.actionButtonText}>Nhắn Tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Phone stroke={Colors.white} width={20} height={20} />
          <Text style={styles.actionButtonText}>Gọi Điện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Video stroke={Colors.white} width={20} height={20} />
          <Text style={styles.actionButtonText}>Video Call</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.priceCard}>
        <Text style={styles.priceTitle}>Giá dịch vụ</Text>
        <Text style={[styles.priceValue, { color: Colors.primary }]}>{trainerData.price}</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Đặt Lịch Ngay</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Gói Tập Luyện</Text>
      <FlatList
        data={trainerData.packages}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <View style={styles.packageCard}>
            <View style={styles.packageHeader}>
              <Text style={styles.packageName}>{item.name}</Text>
              <Text style={[styles.packagePrice, { color: Colors.primary }]}>{item.price.toLocaleString()}đ</Text>
            </View>
            <Text style={styles.packageDuration}>{item.duration}</Text>
            {item.features.map((feature, index) => (
              <Text key={index} style={styles.packageFeature}>✓ {feature}</Text>
            ))}
            <TouchableOpacity style={styles.packageButton}>
              <Text style={styles.packageButtonText}>Chọn Gói Này</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Lịch Trống Trong Tuần</Text>
      <FlatList
        data={trainerData.schedule}
        keyExtractor={item => item.day}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleDay}>{item.day}</Text>
            <View style={styles.scheduleSlots}>
              {item.slots.map((slot, index) => (
                <Text key={index} style={styles.slotTag}>{slot}</Text>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  title: {
    fontSize: 14,
    color: Colors.textLight,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    fontSize: 14,
    color: Colors.text,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  specialtyTag: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 14,
    marginLeft: 8,
  },
  priceCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  packageCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  packageDuration: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  packageFeature: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  packageButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  packageButtonText: {
    color: Colors.white,
    fontSize: 14,
  },
  scheduleItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  scheduleSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slotTag: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
});