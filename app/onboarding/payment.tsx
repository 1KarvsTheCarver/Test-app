import { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useOnboardingStore } from '../../stores/onboarding';
import { createSubscription } from '../../lib/stripe';
import { auth, db } from '../../lib/firebase';

// Price ID from Stripe - replace with your actual price ID
const BETA_PRICE_ID = 'price_1234567890';

export default function PaymentScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { struggle, faithPath, anchorVerse, goal } = useOnboardingStore();

  const handleSubscribe = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create subscription
      const subscriptionId = await createSubscription(BETA_PRICE_ID);

      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        createdAt: new Date(),
        struggle,
        faithPath,
        anchorVerse,
        goal,
        subscription: {
          stripeSubscriptionId: subscriptionId,
          status: 'active',
          priceId: BETA_PRICE_ID,
        },
        coachId: 'admin', // Default coach for now
        streakCount: 0,
        lastCheckInDate: '',
        totalCheckIns: 0,
      });

      router.push('/onboarding/complete');
    } catch (error: any) {
      console.error('Subscription error:', error);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'This email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email address');
      } else {
        Alert.alert(
          'Error',
          'There was a problem setting up your account. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold mb-2 text-gray-900">
          💳 Start Your Journey
        </Text>

        <Text className="text-gray-600 mb-6">
          Join the beta program for just $7.50/month
        </Text>

        <View className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <View className="flex-row items-baseline mb-4">
            <Text className="text-4xl font-bold text-gray-900">$7.50</Text>
            <Text className="text-gray-600 ml-2">/month</Text>
          </View>

          <View className="space-y-2">
            <View className="flex-row items-center mb-2">
              <Text className="text-green-600 mr-2">✓</Text>
              <Text className="text-gray-700">Weekly coach reviews</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-green-600 mr-2">✓</Text>
              <Text className="text-gray-700">Daily check-ins & tracking</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-green-600 mr-2">✓</Text>
              <Text className="text-gray-700">Friction tools & reminders</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-green-600 mr-2">✓</Text>
              <Text className="text-gray-700">Cancel anytime</Text>
            </View>
          </View>
        </View>

        <Input
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Input
          label="Password"
          placeholder="At least 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <Text className="text-xs text-gray-600 text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            Your subscription will renew monthly until you cancel. Cancel anytime from
            your account settings.
          </Text>
        </View>
      </ScrollView>

      <View className="px-6 pb-6">
        <Button
          title="Subscribe & Continue →"
          onPress={handleSubscribe}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}
