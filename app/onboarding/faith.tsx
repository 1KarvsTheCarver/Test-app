import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Does faith play a role in your recovery?
        </Text>

        <Text style={styles.subtitle}>
          We can personalize your experience with faith-based support if you'd like.
        </Text>

        {faithPaths.map((path) => (
          <TouchableOpacity
            key={path.id}
            style={[
              styles.option,
              selected === path.id ? styles.optionSelected : styles.optionDefault
            ]}
            onPress={() => setSelected(path.id)}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <Text style={styles.emoji}>{path.emoji}</Text>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>
                  {path.label}
                </Text>
                <Text style={styles.optionDesc}>{path.desc}</Text>
              </View>
              {selected === path.id && (
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
    fontSize: 14,
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
