import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import ProgressCircle from 'react-native-progress/Circle';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../app-example/components/ui/Navbar';
import { Colors } from '../app-example/constants/Colors';

const { width } = Dimensions.get('window');

export default function HomeScreen({ isDarkMode, setDarkMode }) {
  const userName = "Tuấn";
  const data = [
    { value: 2847, label: "Bước chân" },
    { value: 420, label: "Calo đốt" },
    { value: 7.2, label: "Giờ ngủ" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Card style={[styles.heroCard, { backgroundColor: '#667eea' }]}>
          <Card.Content>
            <Title style={styles.heroTitle}>Chào {userName}! 👋</Title>
            <Paragraph style={styles.heroText}>
              Hôm nay là ngày thứ 12 liên tiếp bạn tập luyện
            </Paragraph>
            <View style={styles.statsGrid}>
              {data.map((item, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
            Hành Động Nhanh
          </Title>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="play-circle" size={24} color="#ef4444" />
              </View>
              <View>
                <Text style={styles.actionTitle}>Bắt Đầu Tập</Text>
                <Text style={styles.actionSubtitle}>Workout mới</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="add" size={24} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.actionTitle}>Ghi Bữa Ăn</Text>
                <Text style={styles.actionSubtitle}>Theo dõi dinh dưỡng</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Progress */}
        <View style={styles.section}>
          <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
            Tiến Độ Hôm Nay
          </Title>
          <View style={styles.progressGrid}>
            <Card style={styles.progressCard}>
              <View style={styles.progressContent}>
                <ProgressCircle
                  size={60}
                  progress={0.75}
                  color="#FF6B6B"
                  thickness={8}
                />
                <View style={styles.progressText}>
                  <Text style={styles.progressLabel}>Calo Mục Tiêu</Text>
                  <Text style={styles.progressValue}>1,890 / 2,520</Text>
                </View>
              </View>
            </Card>
            <Card style={styles.progressCard}>
              <View style={styles.progressContent}>
                <ProgressCircle
                  size={60}
                  progress={0.6}
                  color="#4ECDC4"
                  thickness={8}
                />
                <View style={styles.progressText}>
                  <Text style={styles.progressLabel}>Thời Gian Tập</Text>
                  <Text style={styles.progressValue}>36 / 60 phút</Text>
                </View>
              </View>
            </Card>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroCard: {
    margin: 16,
    borderRadius: 12,
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    marginBottom: 8,
  },
  heroText: {
    color: 'white',
    opacity: 0.9,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    opacity: 0.8,
    fontSize: 12,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionSubtitle: {
    color: 'gray',
    fontSize: 14,
  },
  progressGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressText: {
    marginTop: 8,
    alignItems: 'center',
  },
  progressLabel: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressValue: {
    color: 'gray',
    fontSize: 12,
  },
});