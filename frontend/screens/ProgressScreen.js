import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import ProgressCircle from 'react-native-progress/Circle';
import ProgressBar from 'react-native-progress/Bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../app-example/components/ui/Navbar';
import { Colors } from '../app-example/constants/Colors';

export default function ProgressScreen({ isDarkMode, setDarkMode }) {
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      <ScrollView style={styles.scrollView}>
        {/* Progress Overview */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Title style={styles.overviewTitle}>Tổng Quan Tiến Độ</Title>
            <View style={styles.overviewGrid}>
              <View style={styles.overviewItem}>
                <Text style={styles.emoji}>📈</Text>
                <Text style={styles.statTitle}>Cân Nặng Hiện Tại</Text>
                <Text style={[styles.statValue, { color: '#10b981' }]}>68.5kg</Text>
                <Text style={styles.statChange}>-2.3kg từ tháng trước</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.emoji}>💪</Text>
                <Text style={styles.statTitle}>Khối Lượng Cơ</Text>
                <Text style={[styles.statValue, { color: '#3b82f6' }]}>45.2kg</Text>
                <Text style={styles.statChange}>+1.1kg từ tháng trước</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Body Measurements */}
        <View style={styles.section}>
          <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
            Số Đo Cơ Thể
          </Title>
          <Card style={styles.measurementsCard}>
            <Card.Content>
              {[
                { label: "Vòng Eo", current: "78cm", change: "-3cm", color: "#10b981" },
                { label: "Vòng Ngực", current: "95cm", change: "+2cm", color: "#3b82f6" },
                { label: "Vòng Đùi", current: "58cm", change: "-1cm", color: "#10b981" },
                { label: "Vòng Tay", current: "32cm", change: "+1cm", color: "#3b82f6" },
              ].map((measurement, index) => (
                <View key={index} style={styles.measurementRow}>
                  <Text style={styles.measurementLabel}>{measurement.label}</Text>
                  <View style={styles.measurementValueContainer}>
                    <Text style={styles.measurementValue}>{measurement.current}</Text>
                    <Text style={[styles.measurementChange, { color: measurement.color }]}>
                      {measurement.change}
                    </Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Goals Progress */}
        <View style={styles.section}>
          <Title style={[styles.sectionTitle, { color: isDarkMode ? Colors.darkText : Colors.black }]}>
            Tiến Độ Mục Tiêu
          </Title>
          {[
            { goal: "Giảm xuống 65kg", progress: 75, current: "68.5", target: "65", unit: "kg" },
            { goal: "Chạy 5km không nghỉ", progress: 64, current: "3.2", target: "5", unit: "km" },
            { goal: "Tập 5 ngày/tuần", progress: 80, current: "4", target: "5", unit: "ngày" },
          ].map((goal, index) => (
            <Card key={index} style={styles.goalCard}>
              <Card.Content>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.goal}</Text>
                  <Text style={styles.goalDeadline}>30/12/2024</Text>
                </View>
                <View style={styles.goalProgressRow}>
                  <Text>{goal.current}/{goal.target} {goal.unit}</Text>
                  <Text>{goal.progress}%</Text>
                </View>
                <ProgressBar progress={goal.progress / 100} color="#45B7D1" />
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  overviewCard: { margin: 16, borderRadius: 12 },
  overviewTitle: { fontSize: 18, marginBottom: 16, textAlign: 'center' },
  overviewGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  overviewItem: { alignItems: 'center', flex: 1 },
  emoji: { fontSize: 32, marginBottom: 8 },
  statTitle: { fontSize: 14, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statChange: { fontSize: 12 },
  section: { marginHorizontal: 16 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  measurementsCard: { borderRadius: 12 },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  measurementLabel: { flex: 1 },
  measurementValueContainer: { flexDirection: 'row', alignItems: 'center' },
  measurementValue: { fontWeight: 'bold', marginRight: 8 },
  measurementChange: { fontSize: 12, fontWeight: 'bold' },
  goalCard: { marginBottom: 12, borderRadius: 12 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalTitle: { fontWeight: 'bold', flex: 1 },
  goalDeadline: { fontSize: 12, color: 'gray' },
  goalProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});