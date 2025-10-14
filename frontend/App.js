import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Stack } from 'expo-router';
import LoginScreen from './screens/LoginScreen';
import AccountTypeSelection from './screens/AccountTypeSelection';
import RegisterScreen from './screens/RegisterScreen';
import EditProfileScreen from './screens/EditProfileScreen';

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack initialRouteName="/">
        <Stack.Screen name="/" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AccountTypeSelection" component={AccountTypeSelection} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="app-example/app/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: 'Chỉnh sửa hồ sơ' }} />
      </Stack>
    </NavigationContainer>
  );
}