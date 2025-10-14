import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../app-example/constants/Colors'; // Correct import path
console.log('Colors:', Colors);

    export default function Layout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Workout Tracker' }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});