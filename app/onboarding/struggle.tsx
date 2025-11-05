import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          What brings you here today?
        </Text>

        <Text style={styles.subtitle}>
          Select the area you want to work on
        </Text>

        {struggles.map((struggle) => (
          <TouchableOpacity
            key={struggle.id}
            style={[
              styles.option,
              selected === struggle.id ? styles.optionSelected : styles.optionDefault
            ]}
            onPress={() => setSelected(struggle.id)}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <Text style={styles.emoji}>{struggle.emoji}</Text>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>
                  {struggle.label}
                </Text>
                <Text style={styles.optionDesc}>{struggle.desc}</Text>
              </View>
              {selected === struggle.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !selected && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 24,
  },
  option: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionDefault: {
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  optionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontWeight: '600',
    fontSize: 18,
    color: '#111827',
  },
  optionDesc: {
    color: '#6b7280',
  },
  checkmark: {
    width: 24,
    height: 24,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 24,
    paddingVertical: 16,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});
