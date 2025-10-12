import React, { createContext, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Tabs } from 'expo-router';
import Colors from '../app-example/constants/Colors';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import EditProfileScreen from '@/screens/EditProfileScreen';
import TrainerScreen from '@/screens/TrainerScreen';
import WorkoutDetailScreen from '@/screens/WorkoutDetailScreen';
import MainScreen from '@/screens/MainScreen';

// Create a context for userProfile
export interface UserProfile {
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
}

export interface UserProfileContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileContext.Provider');
  }
  return context;
}

const Stack = createStackNavigator();

export default function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
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
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainScreen} initialParams={{ isDarkMode, setIsDarkMode }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Trainer" component={TrainerScreen} />
          <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProfileContext.Provider>
  );
}