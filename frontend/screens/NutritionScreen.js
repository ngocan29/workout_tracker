import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import ProgressBar from 'react-native-progress/Bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import Navbar from '../app-example/components/ui/Navbar';
import { Colors } from '../app-example/constants/Colors';

export default function NutritionScreen({ isDarkMode, setDarkMode }) {
  const nutritionData = [
    { meal: "Bữa Sáng", calories: 420, protein: 25, carbs: 45, fat: 18 },
    // ... other meals
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setDarkMode} />
      
      <ScrollView style={styles.scrollView}>
        {/* Daily Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Tổng Quan Hôm Nay</Title>
            <View style={styles.nutrientsGrid}>
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: '#3b82f6' }]}>1,630</Text>
                <Text style={styles.nutrientLabel}>Calo</Text>
              </View>
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: '#10b981' }]}>96g</Text>
                <Text style={styles.nutrientLabel}>Protein</Text>
              </View>
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: '#f59e0b' }]}>160g</Text>
                <Text style={styles.nutrientLabel}>Carbs</Text>
              </View>
              <View style={styles.nutrientItem}>
                <Text style={[styles.nutrientValue, { color: '#ef4444' }]}>72g</Text>
                <Text style={styles.nutrientLabel}>Fat</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressRow}>
                <Text>Mục tiêu calo hôm nay</Text>
                <Text>1,630 / 2,200</Text>
              </View>
              <ProgressBar progress={0.74} width={null} color="#4ECDC4" />
            </View>
          </Card.Content>
        </Card>

        {/* Water Intake */}
        <Card style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <Title style={styles.waterTitle}>Lượng Nước Uống</Title>
            <Button icon="plus" mode="outlined" style={styles.addButton}>
              Thêm
            </Button>
          </View>
          <View style={styles.waterProgress}>
            <View style={styles.waterInfo}>
              <Text>6 / 8 ly</Text>
              <Text style={{ color: '#3b82f6' }}>1.5L / 2L</Text>
            </View>
            <ProgressBar progress={0.75} width={200} color="#45B7D1" />
            <Text style={styles.waterEmoji}>💧</Text>
          </View>
        </Card>

        {/* Meal Log */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
              Nhật Ký Bữa Ăn
            </Title>
            <Button mode="contained" style={styles.addButton}>
              Thêm Bữa Ăn
            </Button>
          </View>
          {nutritionData.map((meal, index) => (
            <TouchableOpacity key={index} style={styles.mealCard}>
              <View style={styles.mealRow}>
                <View style={styles.mealIcon}>🍽️</View>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.meal}</Text>
                  <View style={styles.nutrientsRow}>
                    <Text>{meal.calories} cal</Text>
                    <Text>{meal.protein}g protein</Text>
                    <Text>{meal.carbs}g carbs</Text>
                    <Text>{meal.fat}g fat</Text>
                  </View>
                </View>
                <Button mode="outlined" style={styles.detailButton}>
                  Chi Tiết
                </Button>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  summaryCard: { margin: 16, borderRadius: 12 },
  summaryTitle: { fontSize: 18, marginBottom: 16 },
  nutrientsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  nutrientItem: { alignItems: 'center' },
  nutrientValue: { fontSize: 20, fontWeight: 'bold' },
  nutrientLabel: { fontSize: 12, color: 'gray' },
  progressContainer: { marginTop: 8 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  waterCard: { margin: 16, borderRadius: 12 },
  waterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  waterTitle: { fontSize: 18 },
  waterProgress: { alignItems: 'center', padding: 16 },
  waterInfo: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
  waterEmoji: { fontSize: 32, marginTop: 8 },
  section: { marginHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18 },
  mealCard: { backgroundColor: 'white', borderRadius: 12, marginBottom: 12, elevation: 2 },
  mealRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  mealIcon: { fontSize: 24, marginRight: 12 },
  mealInfo: { flex: 1 },
  mealName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  nutrientsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailButton: { marginLeft: 8 },
  addButton: { borderRadius: 8 },
});