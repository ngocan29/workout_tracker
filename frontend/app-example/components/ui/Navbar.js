import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

export default function Navbar({ isDarkMode, setIsDarkMode }) {
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: isDarkMode ? Colors.darkBackground : Colors.white,
      borderBottomColor: isDarkMode ? Colors.darkSurface : '#e5e5e5'
    }]}>
      <View style={styles.left}>
        <TouchableOpacity style={styles.menuIcon}>
        </TouchableOpacity>
        <Text style={[styles.title, { 
          color: isDarkMode ? Colors.darkText : '#333333' 
        }]}>
          Workout Tracker
        </Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity 
          style={[styles.switchContainer, {
            backgroundColor: isDarkMode ? Colors.darkGreen : Colors.lightGreen,
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }]}
          onPress={handleToggleDarkMode}
        >
          <Text style={[styles.switchText, {
            color: isDarkMode ? Colors.white : Colors.white
          }]}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
        </TouchableOpacity>
        <Badge style={[styles.badge, {
          backgroundColor: isDarkMode ? Colors.darkGreen : '#FF6B6B'
        }]}>3</Badge>
        <Ionicons 
          name="notifications-outline" 
          size={24} 
          color={isDarkMode ? Colors.darkText : '#333333'} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchContainer: {
    marginHorizontal: 12,
  },
  switchText: {
    fontSize: 20,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 12,
  },
});