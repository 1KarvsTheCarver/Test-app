import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/onboarding/struggle');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.emoji}>🙏</Text>
          <Text style={styles.title}>
            Welcome to Your Journey
          </Text>
          <Text style={styles.subtitle}>
            You've taken the first step towards accountability and spiritual growth
          </Text>
        </View>

        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>✓</Text>
            <Text style={styles.featureText}>Set your personal goals</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>✓</Text>
            <Text style={styles.featureText}>Track your progress</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>✓</Text>
            <Text style={styles.featureText}>Get AI-powered support</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>✓</Text>
            <Text style={styles.featureText}>Stay accountable with daily check-ins</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 24,
  },
  featureContainer: {
    marginTop: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: 12,
    color: '#2563eb',
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
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
