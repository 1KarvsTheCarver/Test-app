import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            📖 Choose Your Anchor Verse
          </Text>

          <Text style={styles.subtitle}>
            This will appear when you need it most - in moments of temptation and daily reminders.
          </Text>
        </View>

        <View style={styles.selectorContainer}>
          <VerseSelector
            faithPath={faithPath as any}
            onSelect={setSelected}
            selected={selected}
          />
        </View>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 16,
  },
  selectorContainer: {
    flex: 1,
    paddingHorizontal: 24,
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
