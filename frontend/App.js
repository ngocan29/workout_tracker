// src/App.js
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigation';
import Colors from './constants/Colors';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <SafeAreaProvider style={{ backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </SafeAreaProvider>
  );
}