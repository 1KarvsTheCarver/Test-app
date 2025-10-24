import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
import { Button } from '../../components/Button';
import { VerseSelector } from '../../components/VerseSelector';
import { AnchorVerse } from '../../types';

export default function VerseScreen() {
  const router = useRouter();
  const { faithPath, anchorVerse, setAnchorVerse } = useOnboardingStore();
  const [selected, setSelected] = useState<AnchorVerse | null>(anchorVerse);

  const handleContinue = () => {
    if (selected) {
      setAnchorVerse(selected);
      router.push('/onboarding/goal');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold mb-2 text-gray-900">
            📖 Choose Your Anchor Verse
          </Text>

          <Text className="text-gray-600 mb-4">
            This will appear when you need it most - in moments of temptation and daily reminders.
          </Text>
        </View>

        <View className="flex-1 px-6">
          <VerseSelector
            faithPath={faithPath as any}
            onSelect={setSelected}
            selected={selected}
          />
        </View>

        <View className="px-6 pb-6">
          <Button
            title="Continue →"
            onPress={handleContinue}
            disabled={!selected}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
