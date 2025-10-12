import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from '../app-example/app/(tabs)/HomeTab';
import WorkoutTab from '../app-example/app/(tabs)/WorkoutTab';
import NutritionTab from '../app-example/app/(tabs)/NutritionTab';
import ProgressTab from '../app-example/app/(tabs)/ProgressTab';
import ProfileTab from '../app-example/app/(tabs)/ProfileTab';
import Navbar from '../app-example/components/ui/Navbar';
import TabBar from '../app-example/components/ui/TabBar';
import Colors from '../app-example/constants/Colors';
import { useUserProfile } from '../app/_layout';
import { Home, Trophy, Heart, LineChart, User } from 'react-native-feather';

const Tab = createBottomTabNavigator();

export default function MainScreen({ navigation, route }) {
  const { isDarkMode, setIsDarkMode } = route.params || {};
  const { userProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }]}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} userProfile={userProfile} />
      <Tab.Navigator
        tabBar={props => <TabBar {...props} setActiveTab={setActiveTab} isDarkMode={isDarkMode} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: 'Trang Chủ',
            tabBarIcon: ({ color }) => <Home stroke={color} width={24} height={24} />,
          }}
        >
          {props => <HomeTab {...props} userProfile={userProfile} />}
        </Tab.Screen>
        <Tab.Screen
          name="Workout"
          options={{
            tabBarLabel: 'Tập Luyện',
            tabBarIcon: ({ color }) => <Trophy stroke={color} width={24} height={24} />,
          }}
          component={WorkoutTab}
        />
        <Tab.Screen
          name="Nutrition"
          options={{
            tabBarLabel: 'Dinh Dưỡng',
            tabBarIcon: ({ color }) => <Heart stroke={color} width={24} height={24} />,
          }}
          component={NutritionTab}
        />
        <Tab.Screen
          name="Progress"
          options={{
            tabBarLabel: 'Tiến Độ',
            tabBarIcon: ({ color }) => <LineChart stroke={color} width={24} height={24} />,
          }}
        >
          {props => <ProgressTab {...props} userProfile={userProfile} />}
        </Tab.Screen>
        <Tab.Screen
          name="Profile"
          options={{
            tabBarLabel: 'Hồ Sơ',
            tabBarIcon: ({ color }) => <User stroke={color} width={24} height={24} />,
          }}
        >
          {props => <ProfileTab {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});