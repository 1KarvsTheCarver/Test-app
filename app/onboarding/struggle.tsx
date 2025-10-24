import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
import { Button } from '../../components/Button';
import { StruggleType } from '../../types';

const struggles: Array<{
  id: StruggleType;
  label: string;
  desc: string;
  emoji: string;
}> = [
  {
    id: 'porn',
    label: 'Pornography',
    desc: 'Trying to quit or reduce',
    emoji: '🚫',
  },
  {
    id: 'social_media',
    label: 'Social Media',
    desc: 'Instagram, TikTok, Twitter',
    emoji: '📱',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    desc: 'Video games, mobile games',
    emoji: '🎮',
  },
  {
    id: 'phone_overuse',
    label: 'General Phone Overuse',
    desc: "Can't put it down",
    emoji: '📲',
  },
];

export default function StruggleScreen() {
  const router = useRouter();
  const { struggle, setStruggle } = useOnboardingStore();
  const [selected, setSelected] = useState<StruggleType | ''>(struggle);

  const handleContinue = () => {
    if (selected) {
      setStruggle(selected as StruggleType);
      router.push('/onboarding/faith');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold mb-2 text-gray-900">
          What brings you here today?
        </Text>

        <Text className="text-gray-600 mb-6">
          Select the area you want to work on
        </Text>

        {struggles.map((struggle) => (
          <TouchableOpacity
            key={struggle.id}
            className={`border-2 rounded-xl p-4 mb-3 ${
              selected === struggle.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
            onPress={() => setSelected(struggle.id)}
          >
            <View className="flex-row items-center">
              <Text className="text-3xl mr-3">{struggle.emoji}</Text>
              <View className="flex-1">
                <Text className="font-semibold text-lg text-gray-900">
                  {struggle.label}
                </Text>
                <Text className="text-gray-600">{struggle.desc}</Text>
              </View>
              {selected === struggle.id && (
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
