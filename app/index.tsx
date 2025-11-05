import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { width, height } = useWindowDimensions();
  const isDesktop = width > 768;
  const isTablet = width > 480 && width <= 768;

  // Removed auto-redirect - let auth screens handle navigation
  // This prevents race conditions when signing up

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Gradient Background with Circles */}
      <View style={styles.gradientBackground}>
        <View style={[styles.circle1, isDesktop && styles.circle1Desktop]} />
        <View style={[styles.circle2, isDesktop && styles.circle2Desktop]} />
        <View style={[styles.circle3, isDesktop && styles.circle3Desktop]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.scrollContentDesktop
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, isDesktop && styles.contentDesktop]}>
            {/* Logo/Icon */}
            <View style={styles.logoContainer}>
              <View style={[styles.iconCircle, isDesktop && styles.iconCircleDesktop]}>
                <Ionicons name="shield-checkmark" size={isDesktop ? 72 : 56} color="white" />
              </View>
            </View>

            {/* App Name */}
            <Text style={[styles.appName, isDesktop && styles.appNameDesktop]}>
              Accountability
            </Text>

            {/* Tagline */}
            <Text style={[styles.tagline, isDesktop && styles.taglineDesktop]}>
              Break free from digital addiction with real human accountability
            </Text>

            {/* Features */}
            <View style={[styles.featuresContainer, isDesktop && styles.featuresContainerDesktop]}>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Ionicons name="people" size={28} color="#2563eb" />
                </View>
                <Text style={styles.featureText}>Weekly Coach Reviews</Text>
              </View>

              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Ionicons name="trending-up" size={28} color="#2563eb" />
                </View>
                <Text style={styles.featureText}>Smart Tracking Tools</Text>
              </View>

              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Ionicons name="heart" size={28} color="#2563eb" />
                </View>
                <Text style={styles.featureText}>Faith-Based Support</Text>
              </View>
            </View>

            {/* CTA Buttons */}
            <View style={[styles.buttonContainer, isDesktop && styles.buttonContainerDesktop]}>
              <TouchableOpacity
                style={[styles.primaryButton, isDesktop && styles.primaryButtonDesktop]}
                onPress={() => router.push('/auth/signup')}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, isDesktop && styles.secondaryButtonDesktop]}
                onPress={() => router.push('/auth/login')}
                activeOpacity={0.9}
              >
                <Text style={styles.secondaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
              Join 100+ people breaking free from digital addiction
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f9ff',
  },
  circle1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#dbeafe',
    top: -100,
    right: -80,
    opacity: 0.6,
  },
  circle1Desktop: {
    width: 500,
    height: 500,
    borderRadius: 250,
    top: -150,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#bfdbfe',
    bottom: -50,
    left: -50,
    opacity: 0.5,
  },
  circle2Desktop: {
    width: 400,
    height: 400,
    borderRadius: 200,
    bottom: -100,
    left: -80,
  },
  circle3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#93c5fd',
    top: '45%',
    left: -40,
    opacity: 0.4,
  },
  circle3Desktop: {
    width: 280,
    height: 280,
    borderRadius: 140,
    top: '40%',
    left: -60,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  scrollContentDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
    maxWidth: '100%',
  },
  contentDesktop: {
    maxWidth: 600,
    width: '100%',
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircleDesktop: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginTop: 24,
    letterSpacing: -1,
  },
  appNameDesktop: {
    fontSize: 54,
    marginTop: 32,
  },
  tagline: {
    fontSize: 17,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  taglineDesktop: {
    fontSize: 20,
    lineHeight: 30,
    paddingHorizontal: 40,
  },
  featuresContainer: {
    marginTop: 36,
    paddingHorizontal: 10,
  },
  featuresContainerDesktop: {
    marginTop: 48,
    paddingHorizontal: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  buttonContainer: {
    marginTop: 36,
    gap: 14,
  },
  buttonContainerDesktop: {
    marginTop: 48,
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonDesktop: {
    flex: 1,
    paddingVertical: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonDesktop: {
    flex: 1,
    paddingVertical: 20,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 28,
    lineHeight: 20,
  },
});
