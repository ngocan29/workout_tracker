import { Stack } from 'expo-router/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2e7d32',
    accent: '#4caf50',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="account-type" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="branch-home" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ title: 'Chỉnh sửa hồ sơ' }} />
        <Stack.Screen name="workout-detail" options={{ title: 'Chi tiết bài tập' }} />
        <Stack.Screen name="add-workout" options={{ title: 'Thêm bài tập mới' }} />
      </Stack>
    </PaperProvider>
  );
}