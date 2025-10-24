import { initStripe, presentPaymentSheet } from '@stripe/stripe-react-native';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

let isStripeInitialized = false;

export async function initializeStripe() {
  if (isStripeInitialized) return;

  try {
    await initStripe({
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      merchantIdentifier: 'merchant.com.accountability.app',
    });
    isStripeInitialized = true;
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    throw error;
  }
}

export async function createSubscription(priceId: string) {
  try {
    // Ensure Stripe is initialized
    await initializeStripe();

    // Call Firebase Function to create subscription
    const createSub = httpsCallable(functions, 'createSubscription');
    const result = await createSub({ priceId });

    const { clientSecret, subscriptionId } = result.data as {
      clientSecret: string;
      subscriptionId: string;
    };

    // Present payment sheet
    const { error } = await presentPaymentSheet({
      clientSecret,
    });

    if (error) {
      throw new Error(error.message);
    }

    return subscriptionId;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}
