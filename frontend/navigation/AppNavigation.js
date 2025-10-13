import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import TrainerScreen from '../screens/TrainerScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import MainScreen from '../screens/MainScreen';
import { useUserProfile } from '../app-example/app/_layout';

const Stack = createStackNavigator();

export default function AppNavigator({ isDarkMode, setIsDarkMode }) {
  const { userProfile, setUserProfile } = useUserProfile();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main">
        {props => (
          <MainScreen
            {...props}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            userProfile={userProfile}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="EditProfile">
        {props => <EditProfileScreen {...props} userProfile={userProfile} setUserProfile={setUserProfile} />}
      </Stack.Screen>
      <Stack.Screen name="Trainer" component={TrainerScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    </Stack.Navigator>
  );
}