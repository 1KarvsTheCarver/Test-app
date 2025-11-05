# Complete Google Authentication Setup (Web + Mobile)

This guide will help you enable Google Sign-In for **Web, iOS, and Android**.

---

## 🚀 Quick Start (What You Need)

To enable Google Sign-In on mobile, you need:

1. **3 OAuth Client IDs** (Web, iOS, Android) from Google Cloud Console
2. **Configuration files** for native apps
3. **Environment variables** in your project
4. **Updated app.json** configuration

---

## Part 1: Firebase Console Setup

### Step 1: Enable Google Sign-In in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** in the providers list
5. Toggle **Enable** switch
6. Add your **Project support email** (required)
7. Click **Save**

✅ **Status:** This enables Google auth in Firebase (required for all platforms)

---

## Part 2: Google Cloud Console Setup

### Step 2: Create OAuth Client IDs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project (same project)
3. Go to **APIs & Services** → **Credentials**

You'll create **3 OAuth Client IDs**:

#### A. Web Client ID (Already exists from Firebase)

You should already have a Web client ID. If not:
1. Click **Create Credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Name: "Web client (auto created by Google Service)"
4. **Authorized JavaScript origins:**
   - `http://localhost`
   - `http://localhost:8081`
   - Your production domain (e.g., `https://yourdomain.com`)
5. **Authorized redirect URIs:**
   - `http://localhost:8081`
   - Your production domain + `/auth/callback`
6. Click **Create**
7. **Copy the Client ID** - you'll need this!

#### B. iOS Client ID

1. Click **Create Credentials** → **OAuth client ID**
2. Application type: **iOS**
3. Name: "iOS client for Accountability App"
4. **Bundle ID:** `com.accountability.app` (or your custom bundle ID)
5. Click **Create**
6. **Copy the iOS Client ID**

#### C. Android Client ID

1. Click **Create Credentials** → **OAuth client ID**
2. Application type: **Android**
3. Name: "Android client for Accountability App"
4. **Package name:** `com.accountability.app` (or your custom package)
5. **SHA-1 certificate fingerprint:** You need to get this

**To get SHA-1 for development:**

```bash
# On macOS/Linux:
keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android

# On Windows:
keytool -keystore %USERPROFILE%\.android\debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android
```

Copy the **SHA-1 fingerprint** and paste it in Google Cloud Console

6. Click **Create**
7. **Copy the Android Client ID**

---

## Part 3: Download Configuration Files

### For Android:

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Select your **Android app** (or add one if you haven't)
   - Package name: `com.accountability.app`
4. Click **Download google-services.json**
5. Place it at the root of your project: `./google-services.json`

### For iOS:

1. In Firebase Console, **Project Settings** → **Your apps**
2. Select your **iOS app** (or add one if you haven't)
   - Bundle ID: `com.accountability.app`
3. Click **Download GoogleService-Info.plist**
4. Place it at the root of your project: `./GoogleService-Info.plist`

---

## Part 4: Configure Your Project

### Step 3: Create/Update .env file

Create a `.env` file in your project root (if it doesn't exist):

```env
# Firebase Config (you should already have these)
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google OAuth Client IDs (ADD THESE - from Google Cloud Console)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxxxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

⚠️ **Important:** Replace `xxxxx` with your actual Client IDs from Google Cloud Console!

### Step 4: Update app.json

Add the following to your `app.json`:

```json
{
  "expo": {
    "name": "Accountability App",
    "slug": "accountability-app",
    "version": "1.0.0",
    "scheme": "com.accountability.app",
    "extra": {
      "EXPO_PUBLIC_FIREBASE_API_KEY": "your_api_key",
      "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN": "your_domain",
      "EXPO_PUBLIC_FIREBASE_PROJECT_ID": "your_project",
      "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET": "your_storage",
      "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "your_sender",
      "EXPO_PUBLIC_FIREBASE_APP_ID": "your_app_id",
      "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID": "YOUR_WEB_CLIENT_ID",
      "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID": "YOUR_IOS_CLIENT_ID",
      "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID": "YOUR_ANDROID_CLIENT_ID"
    },
    "ios": {
      "bundleIdentifier": "com.accountability.app",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.accountability.app",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "expo-web-browser"
    ]
  }
}
```

---

## Part 5: Update Your Code

The app is now configured to use the new `useGoogleAuth` hook which works on both web and mobile!

### Usage in your components:

```typescript
import { useGoogleAuth } from '../hooks/useGoogleAuth';

function SignupScreen() {
  const { signInWithGoogle, loading, error, isConfigured } = useGoogleAuth();

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();

    if (result.success) {
      // Navigate to next screen
      router.push('/onboarding/welcome');
    }
  };

  return (
    {isConfigured && (
      <TouchableOpacity onPress={handleGoogleSignIn} disabled={loading}>
        <Text>Continue with Google</Text>
      </TouchableOpacity>
    )}
  );
}
```

---

## Part 6: Build and Test

### For Web (Already Working):
```bash
npm start
# Press 'w' for web
```

### For iOS:
```bash
# First time: Generate native code
npx expo prebuild --platform ios

# Then build
npx expo run:ios
```

### For Android:
```bash
# First time: Generate native code
npx expo prebuild --platform android

# Then build
npx expo run:android
```

---

## ✅ Verification Checklist

- [ ] Google Sign-In enabled in Firebase Console
- [ ] Web OAuth Client ID created in Google Cloud Console
- [ ] iOS OAuth Client ID created in Google Cloud Console
- [ ] Android OAuth Client ID created with SHA-1 fingerprint
- [ ] `google-services.json` downloaded and placed in project root
- [ ] `GoogleService-Info.plist` downloaded and placed in project root
- [ ] `.env` file created with all 3 Client IDs
- [ ] `app.json` updated with configuration
- [ ] Tested on web browser
- [ ] Tested on iOS device/simulator
- [ ] Tested on Android device/emulator

---

## 🐛 Common Issues

### "Sign-in cancelled" on mobile
- **Cause:** User closed the auth popup
- **Solution:** This is normal behavior

### "Configuration error" on mobile
- **Cause:** Missing Client IDs in .env
- **Solution:** Make sure all 3 Client IDs are in your .env file

### "Developer Error" on Android
- **Cause:** Wrong SHA-1 fingerprint
- **Solution:** Use the debug keystore SHA-1 for development

### "Popup blocked" on web
- **Cause:** Browser blocking popups
- **Solution:** Allow popups for localhost:8081

### Still only working on web?
- **Cause:** Haven't run `npx expo prebuild` yet
- **Solution:** Run prebuild to generate native code with Google auth

---

## 📱 Current Status

| Platform | Status | Requirements |
|----------|--------|--------------|
| Web      | ✅ Working | Web Client ID (already configured) |
| iOS      | ⏳ Needs Setup | iOS Client ID + GoogleService-Info.plist |
| Android  | ⏳ Needs Setup | Android Client ID + google-services.json + SHA-1 |

---

## 🔐 Security Notes

1. **Never commit** `.env` file to Git
2. **Never commit** `google-services.json` or `GoogleService-Info.plist` to public repos
3. Add to `.gitignore`:
   ```
   .env
   .env.local
   google-services.json
   GoogleService-Info.plist
   ```

4. For production, use environment variables from your hosting platform
5. Rotate keys if they're ever exposed

---

## 🆘 Need Help?

- **Firebase Auth Docs:** https://firebase.google.com/docs/auth/web/google-signin
- **Expo Auth Session:** https://docs.expo.dev/versions/latest/sdk/auth-session/
- **Google Cloud Console:** https://console.cloud.google.com

The web version is working now! Mobile requires the additional steps above.
