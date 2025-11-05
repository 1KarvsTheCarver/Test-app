import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';
import { Platform } from 'react-native';

/**
 * Sign in with Google (Web only for now)
 * For mobile, you'll need to set up Google Sign-In with expo-auth-session
 */
export const signInWithGoogleWeb = async (): Promise<{ success: boolean; error?: string; user?: any }> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);

    // Handle specific error codes
    if (error.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-in cancelled' };
    } else if (error.code === 'auth/popup-blocked') {
      return { success: false, error: 'Popup blocked by browser. Please allow popups and try again.' };
    } else if (error.code === 'auth/cancelled-popup-request') {
      return { success: false, error: 'Another sign-in popup is already open' };
    }

    return {
      success: false,
      error: error.message || 'An error occurred during Google sign-in'
    };
  }
};

/**
 * Check if Google Sign-In is available on this platform
 */
export const isGoogleSignInAvailable = (): boolean => {
  // Currently only supporting web
  // Mobile support requires additional setup in Firebase Console and app.json
  return Platform.OS === 'web';
};
