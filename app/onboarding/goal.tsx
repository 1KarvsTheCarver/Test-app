import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
import { Button } from '../../components/Button';
import { GoalType } from '../../types';

const goals: Array<{
  id: GoalType;
  label: string;
  desc: string;
  emoji: string;
}> = [
  {
    id: 'abstinence',
    label: 'Complete Abstinence',
    desc: 'I want to quit completely (0 tolerance)',
    emoji: '🎯',
  },
  {
    id: 'moderation',
    label: 'Moderation',
    desc: 'I want to reduce and set healthy limits',
    emoji: '⚖️',
  },
];

export default function GoalScreen() {
  const router = useRouter();
  const { goal, setGoal } = useOnboardingStore();
  const [selected, setSelected] = useState<GoalType | ''>(goal?.type || '');

  const handleContinue = () => {
    if (selected) {
      setGoal({ type: selected as GoalType, limits: {} });
      router.push('/onboarding/permissions');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold mb-2 text-gray-900">
          What's your goal?
        </Text>

        <Text className="text-gray-600 mb-6">
          Choose the approach that works best for you
        </Text>

        {goals.map((g) => (
          <TouchableOpacity
            key={g.id}
            className={`border-2 rounded-xl p-4 mb-3 ${
              selected === g.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
            onPress={() => setSelected(g.id)}
          >
            <View className="flex-row items-center">
              <Text className="text-3xl mr-3">{g.emoji}</Text>
              <View className="flex-1">
                <Text className="font-semibold text-lg text-gray-900">
                  {g.label}
                </Text>
                <Text className="text-gray-600">{g.desc}</Text>
              </View>
              {selected === g.id && (
                <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
                  <Text className="text-white font-bold">✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
          <Text className="text-sm text-gray-700">
            💡 <Text className="font-semibold">Tip:</Text> You can adjust your goals later.
            Your coach will help you find what works best for your situation.
          </Text>
        </View>
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
