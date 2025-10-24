import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
import { Button } from '../../components/Button';
import { FaithPath } from '../../types';

const faithPaths: Array<{
  id: FaithPath;
  label: string;
  desc: string;
  emoji: string;
}> = [
  {
    id: 'christian',
    label: 'Yes - Christianity',
    desc: 'Biblical encouragement & Christian accountability',
    emoji: '✝️',
  },
  {
    id: 'muslim',
    label: 'Yes - Islam',
    desc: 'Quranic guidance & Islamic principles of taqwa',
    emoji: '☪️',
  },
  {
    id: 'secular',
    label: 'No - Secular approach',
    desc: 'Science-based recovery only',
    emoji: '🧠',
  },
];

export default function FaithScreen() {
  const router = useRouter();
  const { faithPath, setFaithPath } = useOnboardingStore();
  const [selected, setSelected] = useState<FaithPath | ''>(faithPath);

  const handleContinue = () => {
    if (selected) {
      setFaithPath(selected as FaithPath);
      router.push('/onboarding/verse');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold mb-2 text-gray-900">
          Does faith play a role in your recovery?
        </Text>

        <Text className="text-gray-600 mb-6">
          We can personalize your experience with faith-based support if you'd like.
        </Text>

        {faithPaths.map((path) => (
          <TouchableOpacity
            key={path.id}
            className={`border-2 rounded-xl p-4 mb-3 ${
              selected === path.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
            onPress={() => setSelected(path.id)}
          >
            <View className="flex-row items-center">
              <Text className="text-3xl mr-3">{path.emoji}</Text>
              <View className="flex-1">
                <Text className="font-semibold text-lg text-gray-900">
                  {path.label}
                </Text>
                <Text className="text-gray-600 text-sm">{path.desc}</Text>
              </View>
              {selected === path.id && (
                <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                  <Text className="text-white font-bold">✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-6 pb-6">
        <Button
          title="Continue →"
          onPress={handleContinue}
          disabled={!selected}
        />
      </View>
    </SafeAreaView>
  );
}
