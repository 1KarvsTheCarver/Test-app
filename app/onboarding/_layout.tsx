import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#2563eb',
        headerTitle: '',
      }}
    />
  );
}
