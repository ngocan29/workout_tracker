import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Colors } from '../../constants/Colors'; // Correct path

const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', route: '/(tabs)/index' },
    { name: 'Explore', route: '/(tabs)/explore' },
    { name: 'Workout', route: '/(tabs)/WorkoutTab' },
    { name: 'Nutrition', route: '/(tabs)/NutritionTab' },
    { name: 'Profile', route: '/(tabs)/ProfileTab' },
    { name: 'Progress', route: '/(tabs)/ProgressTab' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[styles.tab, pathname === tab.route && styles.activeTab]}
          onPress={() => router.push(tab.route)}
        >
          <Text
            style={[styles.tabText, pathname === tab.route && styles.activeTabText]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.gray,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default TabBar;