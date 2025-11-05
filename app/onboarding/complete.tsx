import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';

export default function CompleteScreen() {
  const router = useRouter();
  const { reset } = useOnboardingStore();

  const handleContinue = () => {
    reset();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎉</Text>
          </View>

          <Text style={styles.title}>
            Welcome to Your{'\n'}Accountability Journey!
          </Text>

          <Text style={styles.subtitle}>
            You've taken the first step toward freedom
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>
            What happens next?
          </Text>

          <View>
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>
                  Daily Check-Ins
                </Text>
                <Text style={styles.stepDescription}>
                  Track your progress every day with simple check-ins
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>
                  Coach Assignment
                </Text>
                <Text style={styles.stepDescription}>
                  You'll be assigned a dedicated coach within 24 hours
                </Text>
              </View>
            </View>

            <View style={[styles.stepContainer, styles.stepContainerLast]}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>
                  Weekly Reviews
                </Text>
                <Text style={styles.stepDescription}>
                  Get personalized feedback and encouragement every week
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💪 <Text style={styles.tipTextBold}>Pro tip:</Text> Set up daily notifications
            to remind you to check in. Consistency is key to success!
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started →</Text>
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
    paddingTop: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#dcfce7',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#111827',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  infoCardTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 16,
    color: '#111827',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepContainerLast: {
    marginBottom: 0,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    color: '#6b7280',
    fontSize: 14,
  },
  tipCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipText: {
    textAlign: 'center',
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
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});
