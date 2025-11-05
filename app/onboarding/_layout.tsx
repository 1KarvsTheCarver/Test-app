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
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="faith" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="struggle" />
      <Stack.Screen name="verse" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
