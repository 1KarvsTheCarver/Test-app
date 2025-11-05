import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PermissionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (Platform.OS === 'web') {
      // On web, just navigate to next screen
      router.push('/onboarding/payment');
      return;
    }

    // Native permission handling will go here later
    router.push('/onboarding/payment');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.title}>📱 App Permissions</Text>

        <Text style={styles.subtitle}>
          We need a few permissions to help you stay accountable
        </Text>

        <View style={styles.permissionsList}>
          <View style={styles.permissionItem}>
            <Text style={styles.permissionIcon}>🔔</Text>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>Notifications</Text>
              <Text style={styles.permissionDescription}>
                Daily reminders and coach messages
              </Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <Text style={styles.permissionIcon}>📊</Text>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>App Tracking</Text>
              <Text style={styles.permissionDescription}>
                Monitor your app usage to provide insights
              </Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <Text style={styles.permissionIcon}>🔒</Text>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>Privacy</Text>
              <Text style={styles.permissionDescription}>
                Your data is encrypted and never shared
              </Text>
            </View>
          </View>
        </View>

        {Platform.OS === 'web' && (
          <Text style={styles.webNote}>
            Permission setup is handled on mobile devices
          </Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Continue →'}
          </Text>
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
    paddingTop: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 32,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 4,
    width: '86%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  permissionsList: {
    gap: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 16,
  },
  permissionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  webNote: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 32,
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