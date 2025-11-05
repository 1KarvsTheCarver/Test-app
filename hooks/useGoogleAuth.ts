import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// Get client IDs from environment or expo config
const getClientIds = () => {
  const extra = Constants.expoConfig?.extra || {};

  return {
    webClientId: extra.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
                 process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    iosClientId: extra.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
                 process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: extra.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
                     process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
  };
};

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const clientIds = getClientIds();

  // Setup Google Auth Request for mobile
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: clientIds.webClientId,
    iosClientId: clientIds.iosClientId,
    androidClientId: clientIds.androidClientId,
    // Include these for better compatibility
    expoClientId: clientIds.webClientId,
  });

  // Handle the response from Google Auth
  useEffect(() => {
    if (response?.type === 'success') {
      handleMobileSignIn(response);
    }
  }, [response]);

  const handleMobileSignIn = async (response: any) => {
    try {
      setLoading(true);
      setError('');

      const { id_token, access_token } = response.params;

      // Create Firebase credential
      const credential = GoogleAuthProvider.credential(id_token, access_token);

      // Sign in to Firebase
      await signInWithCredential(auth, credential);

      setLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error('Mobile Google Sign-In Error:', error);
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const handleWebSignIn = async () => {
    try {
      setLoading(true);
      setError('');

      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      const result = await signInWithPopup(auth, provider);

      setLoading(false);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Web Google Sign-In Error:', error);

      let errorMessage = 'Failed to sign in with Google';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked by browser. Please allow popups and try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Another sign-in popup is already open';
      }

      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const signInWithGoogle = async () => {
    if (Platform.OS === 'web') {
      return await handleWebSignIn();
    } else {
      // For mobile, trigger the OAuth flow
      if (!request) {
        setError('Google Sign-In is not configured. Please check your credentials.');
        return { success: false, error: 'Configuration error' };
      }

      setLoading(true);
      await promptAsync();
      // The actual sign-in will be handled by the useEffect hook
      return { success: true }; // Will be updated by the effect
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
    isConfigured: Platform.OS === 'web' ? true : !!request,
  };
};
