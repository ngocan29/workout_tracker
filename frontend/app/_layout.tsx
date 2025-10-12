import React, { createContext, useContext, useState } from 'react';
import { Tabs } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { Home, Star, Heart, PieChart, User } from 'react-native-feather';
import Colors from '../app-example/constants/Colors';

// Define the UserProfile shape
type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  currentWeight: number;
  targetWeight: number;
  height: number;
  gender: string;
  fitnessLevel: string;
  location: string;
  occupation: string;
  bio: string;
};

// Create a context for userProfile with proper typing and default value
type UserProfileContextType = {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileContext.Provider');
  }
  return context;
}

export default function Layout() {
  const [userProfile, setUserProfile] = useState({
    name: 'Nguyễn Minh Tuấn',
    email: 'minhtuan@gmail.com',
    avatar: 'https://via.placeholder.com/150',
    currentWeight: 70,
    targetWeight: 65,
    height: 170,
    gender: 'male',
    fitnessLevel: 'intermediate',
    location: 'Hà Nội',
    occupation: 'Kỹ sư',
    bio: 'Yêu thích tập luyện và sống khỏe mạnh!',
  });

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      <NavigationContainer>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textLight,
            tabBarStyle: { backgroundColor: Colors.white },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Trang Chủ',
              tabBarIcon: ({ color }) => <Home stroke={color} width={24} height={24} />,
            }}
          />
          <Tabs.Screen
            name="workout"
            options={{
              title: 'Tập Luyện',
              tabBarIcon: ({ color }) => <Star stroke={color} width={24} height={24} />,
            }}
          />
          <Tabs.Screen
            name="nutrition"
            options={{
              title: 'Dinh Dưỡng',
              tabBarIcon: ({ color }) => <Heart stroke={color} width={24} height={24} />,
            }}
          />
          <Tabs.Screen
            name="progress"
            options={{
              title: 'Tiến Độ',
              tabBarIcon: ({ color }) => <PieChart stroke={color} width={24} height={24} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Hồ Sơ',
              tabBarIcon: ({ color }) => <User stroke={color} width={24} height={24} />,
            }}
          />
        </Tabs>
      </NavigationContainer>
    </UserProfileContext.Provider>
  );
}