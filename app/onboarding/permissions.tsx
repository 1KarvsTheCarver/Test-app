import { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Button } from '../../components/Button';
import { requestScreenTimePermission } from '../../lib/screentime';

export default function PermissionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState({
    notifications: false,
    screenTime: false,
    tracking: false,
  });

  const requestAllPermissions = async () => {
    setLoading(true);

    try {
      // Request notification permission
      const notifResult = await Notifications.requestPermissionsAsync();
      const notifGranted = notifResult.status === 'granted';

      // Request tracking transparency (iOS)
      let trackingGranted = false;
      try {
        const trackingResult = await requestTrackingPermissionsAsync();
        trackingGranted = trackingResult.status === 'granted';
      } catch (error) {
        // Not available on Android
        trackingGranted = true;
      }

      // Request screen time permission
      const screenTimeGranted = await requestScreenTimePermission();

      setPermissions({
        notifications: notifGranted,
        screenTime: screenTimeGranted,
        tracking: trackingGranted,
      });

      // Continue even if some permissions are denied
      router.push('/onboarding/payment');
    } catch (error) {
      Alert.alert(
        'Error',
        'There was a problem requesting permissions. You can continue and set them up later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/payment');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold mb-2 text-gray-900">
          🔔 Enable Permissions
        </Text>

        <Text className="text-gray-600 mb-6">
          To provide the best accountability experience, we need a few permissions.
        </Text>

        <View className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-3">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">📱</Text>
            <View className="flex-1">
              <Text className="font-semibold text-lg text-gray-900 mb-1">
                Screen Time Tracking
              </Text>
              <Text className="text-gray-600 text-sm">
                Helps us understand your usage patterns to provide better support
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-3">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">🔔</Text>
            <View className="flex-1">
              <Text className="font-semibold text-lg text-gray-900 mb-1">
                Notifications
              </Text>
              <Text className="text-gray-600 text-sm">
                Daily reminders and encouragement when you need it
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-6">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">🔒</Text>
            <View className="flex-1">
              <Text className="font-semibold text-lg text-gray-900 mb-1">
                Privacy & Tracking
              </Text>
              <Text className="text-gray-600 text-sm">
                We use this to improve your experience, not to sell your data
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <Text className="text-sm text-gray-700">
            🔐 <Text className="font-semibold">Your privacy matters.</Text> All data is
            encrypted and only accessible to you and your assigned coach. We never share
            or sell your information.
          </Text>
        </View>
      </ScrollView>

      <View className="px-6 pb-6">
        <Button
          title="Grant Permissions"
          onPress={requestAllPermissions}
          loading={loading}
          className="mb-3"
        />

        <Button
          title="Skip for Now"
          onPress={handleSkip}
          variant="outline"
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}
