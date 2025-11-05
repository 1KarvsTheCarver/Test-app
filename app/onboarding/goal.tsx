import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          What's your goal?
        </Text>

        <Text style={styles.subtitle}>
          Choose the approach that works best for you
        </Text>

        {goals.map((g) => (
          <TouchableOpacity
            key={g.id}
            style={[
              styles.option,
              selected === g.id ? styles.optionSelected : styles.optionDefault
            ]}
            onPress={() => setSelected(g.id)}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <Text style={styles.emoji}>{g.emoji}</Text>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>
                  {g.label}
                </Text>
                <Text style={styles.optionDesc}>{g.desc}</Text>
              </View>
              {selected === g.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 <Text style={styles.tipTextBold}>Tip:</Text> You can adjust your goals later.
            Your coach will help you find what works best for your situation.
          </Text>
        </View>
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
  tipCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
  },
  tipTextBold: {
    fontWeight: '600',
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
