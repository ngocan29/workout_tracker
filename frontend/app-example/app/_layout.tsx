import { Tabs } from 'expo-router';
import TabBar from '../components/ui/TabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={() => <TabBar />}>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="explore" options={{ headerShown: false }} />
      <Tabs.Screen name="HomeTab" options={{ headerShown: false }} />
      <Tabs.Screen name="NutritionTab" options={{ headerShown: false }} />
      <Tabs.Screen name="ProfileTab" options={{ headerShown: false }} />
      <Tabs.Screen name="ProgressTab" options={{ headerShown: false }} />
      <Tabs.Screen name="WorkoutTab" options={{ headerShown: false }} />
    </Tabs>
  );
}