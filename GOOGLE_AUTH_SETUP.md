# Google Authentication Setup Guide

This guide will help you set up Google Sign-In for your Accountability App.

## Prerequisites
- Firebase project set up
- Firebase Authentication enabled in your project

## Setup Steps

### 1. Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** in the providers list
5. Toggle **Enable** switch
6. Add your **Project support email** (required)
7. Click **Save**

### 2. Configure Web Support (Required for Testing on Web)

The Google Sign-In is currently configured to work on **Web** only. Mobile support requires additional setup.

**For Web:**
- No additional configuration needed
- The Firebase config automatically handles web authentication
- Make sure your Firebase hosting domain is authorized in Firebase Console

### 3. Add OAuth 2.0 Client IDs (Optional - For Mobile)

If you want to enable Google Sign-In on mobile devices:

#### For Android:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Create OAuth 2.0 Client ID for Android
5. Add your package name and SHA-1 certificate fingerprint
6. Copy the Client ID
7. Add to your `.env` file:
   ```
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
   ```

#### For iOS:
1. In Google Cloud Console, create OAuth 2.0 Client ID for iOS
2. Add your iOS Bundle ID
3. Copy the Client ID
4. Add to your `.env` file:
   ```
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id
   ```

#### Web Client ID:
1. You should already have a Web Client ID from Firebase
2. Add it to your `.env` file:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id
   ```

### 4. Update app.json (For Mobile Support)

Add the following to your `app.json`:

```json
{
  "expo": {
    "scheme": "com.accountability-app",
    "ios": {
      "bundleIdentifier": "com.accountability-app",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.accountability.app",
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### 5. Testing

#### On Web:
1. Run `npm start`
2. Press `w` to open in web browser
3. Navigate to signup or login page
4. Click "Continue with Google" button
5. Complete the Google authentication flow

#### On Mobile:
- Mobile support requires completing steps 3 and 4 above
- You'll also need to run `npx expo prebuild` and build native apps

## Current Status

✅ **Working:** Google Sign-In on Web
⏳ **Pending:** Google Sign-In on Mobile (requires additional setup)

## Features Implemented

- **Signup Screen:** Google Sign-In button with proper error handling
- **Login Screen:** Google Sign-In button with proper error handling
- **Responsive Design:** Works on all screen sizes
- **Error Handling:** User-friendly error messages for common issues
- **Loading States:** Shows loading spinner during authentication
- **Navigation:** Automatically redirects after successful sign-in

## Common Issues

### "Popup blocked by browser"
**Solution:** Allow popups for your development URL (localhost:8081)

### "Sign-in cancelled"
**Solution:** User closed the popup before completing authentication

### "Google Sign-In not available"
**Solution:** Button only shows on web platform currently. Mobile support coming soon.

## Security Notes

- Never commit your `.env` file with credentials
- Keep your OAuth Client IDs secure
- Use appropriate scopes (currently using 'profile' and 'email')
- Firebase handles token validation and security

## Next Steps

To enable mobile support:
1. Complete the OAuth Client ID setup for Android/iOS
2. Download and add `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
3. Update the `googleAuth.ts` file to enable mobile platforms
4. Test on physical devices or emulators

## Support

For more information:
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Expo Auth Session Docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google Sign-In for Firebase](https://firebase.google.com/docs/auth/web/google-signin)
