# Google Sign-In Quick Start

## Current Status: ✅ Working on Web

**Google Sign-In is already working on web browsers!** Just enable it in Firebase Console.

## For Web Only (5 minutes):

1. Go to [Firebase Console](https://console.firebase.google.com) → Your Project
2. Click **Authentication** → **Sign-in method**
3. Enable **Google**
4. Add your support email
5. Save
6. **Done!** Test it by running `npm start` and pressing `w` for web

---

## To Enable on Mobile (iOS/Android):

Mobile requires additional setup because native apps need OAuth credentials from Google Cloud Console.

### What You Need:
- **iOS Client ID** from Google Cloud Console
- **Android Client ID** from Google Cloud Console
- **Configuration files** (`google-services.json` and `GoogleService-Info.plist`)
- **Environment variables** in `.env` file

### Quick Steps:

1. **Get OAuth Client IDs:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - APIs & Services → Credentials
   - Create OAuth Client IDs for iOS and Android
   - See full guide: `MOBILE_GOOGLE_AUTH_SETUP.md`

2. **Add to .env:**
   ```
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
   ```

3. **Download config files:**
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)
   - Place in project root

4. **Build native apps:**
   ```bash
   npx expo prebuild
   npx expo run:ios     # or run:android
   ```

📖 **Full mobile setup guide:** See `MOBILE_GOOGLE_AUTH_SETUP.md`

---

## Why Mobile Needs Extra Setup?

- **Web:** Uses browser-based OAuth (popup) - works out of the box
- **Mobile:** Uses native OAuth flow - requires platform-specific credentials

Think of it like:
- Web = Universal login
- iOS = Needs iOS app credentials
- Android = Needs Android app credentials

---

## Summary

| What                | Status | Time Required |
|---------------------|--------|---------------|
| Web Google Sign-In  | ✅ Ready | 5 minutes |
| Mobile Google Sign-In | ⏳ Setup Required | 20-30 minutes |

The web version works great for development and testing! Mobile can be added when you're ready to deploy native apps.
