import { View, Text, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-6 py-12">
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">🛡️</Text>
          </View>

          <Text className="text-3xl font-bold text-center mb-4 text-gray-900">
            BREAK FREE FROM{'\n'}DIGITAL ADDICTION
          </Text>

          <Text className="text-lg text-gray-600 text-center mb-8">
            Real human accountability{'\n'}that actually works
          </Text>
        </View>

        <View className="bg-gray-50 rounded-xl p-6 mb-8">
          <View className="mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1 text-base">
                Weekly coach reviews
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1 text-base">
                Smart tracking & friction tools
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1 text-base">
                Faith-based support (optional)
              </Text>
            </View>
          </View>
        </View>

        <Button
          title="Get Started →"
          onPress={() => router.push('/onboarding/struggle')}
          className="mb-6"
        />

        <Text className="text-center text-sm text-gray-500">
          Trusted by 100+ people breaking free every day
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
