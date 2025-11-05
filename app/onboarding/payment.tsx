import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const router = useRouter();

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>💳 Start Your Journey</Text>
          
          <Text style={styles.subtitle}>
            Join the beta program for just $7.50/month
          </Text>

          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>$7.50</Text>
              <Text style={styles.priceFrequency}>/month</Text>
            </View>

            <View style={styles.benefitsList}>
              <View style={styles.benefitRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.benefitText}>Weekly coach reviews</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.benefitText}>Daily check-ins & tracking</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.benefitText}>Friction tools & reminders</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.benefitText}>Cancel anytime</Text>
              </View>
            </View>
          </View>

          <Text style={styles.webMessage}>
            Payment setup requires the mobile app. Please continue on iOS or Android to complete your subscription.
          </Text>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/onboarding/complete')}
          >
            <Text style={styles.buttonText}>Skip for Now →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>💳 Payment Setup</Text>
        <Text style={styles.subtitle}>
          Payment integration coming soon...
        </Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding/complete')}
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
    paddingTop: 32,
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
    marginBottom: 24,
  },
  priceCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#93c5fd',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
  },
  priceFrequency: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  benefitsList: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    color: '#16a34a',
    marginRight: 8,
    fontSize: 18,
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
  },
  webMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
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