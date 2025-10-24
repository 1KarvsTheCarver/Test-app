import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { useOnboardingStore } from '../../stores/onboarding';

export default function CompleteScreen() {
  const router = useRouter();
  const { reset } = useOnboardingStore();

  const handleContinue = () => {
    reset();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-12">
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <Text className="text-5xl">🎉</Text>
          </View>

          <Text className="text-3xl font-bold text-center mb-4 text-gray-900">
            Welcome to Your{'\n'}Accountability Journey!
          </Text>

          <Text className="text-lg text-gray-600 text-center mb-8">
            You've taken the first step toward freedom
          </Text>
        </View>

        <View className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <Text className="font-semibold text-lg mb-4 text-gray-900">
            What happens next?
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-start mb-3">
              <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">
                  Daily Check-Ins
                </Text>
                <Text className="text-gray-600 text-sm">
                  Track your progress every day with simple check-ins
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">
                  Coach Assignment
                </Text>
                <Text className="text-gray-600 text-sm">
                  You'll be assigned a dedicated coach within 24 hours
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">
                  Weekly Reviews
                </Text>
                <Text className="text-gray-600 text-sm">
                  Get personalized feedback and encouragement every week
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <Text className="text-center text-gray-700">
            💪 <Text className="font-semibold">Pro tip:</Text> Set up daily notifications
            to remind you to check in. Consistency is key to success!
          </Text>
        </View>
      </ScrollView>

      <View className="px-6 pb-6">
        <Button
          title="Get Started →"
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}
