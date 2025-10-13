import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { nutritionData } from '../../constants/Data';
import Colors from '../../constants/Colors';
import NutritionModal from '../../components/ui/NutritionModal';

export default function NutritionTab() {
  const [showNutritionModal, setShowNutritionModal] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Tổng Quan Hôm Nay</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.primary }]}>1,630</Text>
            <Text style={styles.summaryLabel}>Calo</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>96g</Text>
            <Text style={styles.summaryLabel}>Protein</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.warning }]}>160g</Text>
            <Text style={styles.summaryLabel}>Carbs</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.error }]}>72g</Text>
            <Text style={styles.summaryLabel}>Fat</Text>
          </View>
        </View>
      </View>
      <View style={styles.waterCard}>
        <View style={styles.waterHeader}>
          <Text style={styles.sectionTitle}>Lượng Nước Uống</Text>
          <TouchableOpacity style={styles.addWaterButton}>
            <Text style={styles.addWaterText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.waterInfo}>
          <View>
            <Text style={styles.waterProgress}>6 / 8 ly</Text>
            <Text style={[styles.waterProgress, { color: Colors.primary }]}>1.5L / 2L</Text>
          </View>
          <Text style={styles.waterIcon}>💧</Text>
        </View>
      </View>
      <View style={styles.mealHeader}>
        <Text style={styles.sectionTitle}>Nhật Ký Bữa Ăn</Text>
        <TouchableOpacity style={styles.addMealButton} onPress={() => setShowNutritionModal(true)}>
          <Text style={styles.addMealText}>Thêm Bữa Ăn</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={nutritionData}
        keyExtractor={item => item.meal}
        renderItem={({ item }) => (
          <View style={styles.mealCard}>
            <Image source={{ uri: item.image }} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <Text style={styles.mealTitle}>{item.meal}</Text>
              <View style={styles.mealDetails}>
                <Text style={styles.mealDetail}>{item.calories} cal</Text>
                <Text style={styles.mealDetail}>{item.protein}g protein</Text>
                <Text style={styles.mealDetail}>{item.carbs}g carbs</Text>
                <Text style={styles.mealDetail}>{item.fat}g fat</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.mealButton}>
              <Text style={styles.mealButtonText}>Chi Tiết</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <NutritionModal visible={showNutritionModal} onClose={() => setShowNutritionModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  waterCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addWaterButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 8,
  },
  addWaterText: {
    color: Colors.white,
    fontSize: 14,
  },
  waterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  waterProgress: {
    fontSize: 16,
    color: Colors.text,
  },
  waterIcon: {
    fontSize: 36,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addMealButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 12,
  },
  addMealText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  mealImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  mealDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mealDetail: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 8,
  },
  mealButton: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 8,
  },
  mealButtonText: {
    fontSize: 14,
    color: Colors.primary,
  },
});