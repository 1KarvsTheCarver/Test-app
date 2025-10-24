# Digital Accountability App - MVP

A React Native mobile app for digital accountability with real human coaching, built with Expo, Firebase, and Stripe.

## 🎯 Features

- **User Onboarding** (8 screens): Struggle selection, faith path, anchor verses, goals, permissions, payment
- **Daily Check-In**: Track daily progress with status updates (clean, struggled, slip, relapse)
- **Streak Counter**: Visual tracking of consecutive clean days
- **Coach Reviews**: Weekly personalized feedback from human coaches
- **Friction Tools**: Pause screens with anchor verses to prevent relapses
- **Faith-Based Support**: Optional Christian, Muslim, or secular approaches
- **Screen Time Tracking**: Integration with device usage monitoring

## 🛠 Tech Stack

- **Frontend**: React Native + Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Payments**: Stripe
- **State Management**: Zustand

## 📋 Prerequisites

- Node.js 18+ installed
- Expo CLI: `npm install -g expo-cli`
- Firebase CLI: `npm install -g firebase-tools`
- Stripe account
- Firebase project
- iOS/Android development environment (or Expo Go app for testing)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd accountability-app
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Get your Firebase config from Project Settings

```bash
# Initialize Firebase
firebase login
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting (for admin panel)
```

5. Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then fill in your Firebase and Stripe credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create a product: "Beta Subscription"
3. Create a price: $7.50/month recurring
4. Get your API keys from the Stripe dashboard
5. Update the `BETA_PRICE_ID` in `app/onboarding/payment.tsx` with your price ID

Set Stripe secret in Firebase Functions:

```bash
firebase functions:config:set stripe.secret_key="sk_test_..." stripe.webhook_secret="whsec_..."
```

### 5. Deploy Firebase Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 6. Run the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web (for testing)
npm run web
```

## 📱 App Structure

```
/accountability-app
├── /app                      # Expo Router pages
│   ├── index.tsx            # Welcome screen
│   ├── /onboarding          # 8 onboarding screens
│   └── /(tabs)              # Main app (home, checkin, review)
├── /components              # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── VerseSelector.tsx
│   └── FrictionModal.tsx
├── /lib                     # Utilities
│   ├── firebase.ts
│   ├── stripe.ts
│   └── screentime.ts
├── /stores                  # Zustand state management
│   ├── onboarding.ts
│   └── user.ts
├── /types                   # TypeScript types
├── /functions               # Firebase Cloud Functions
├── /admin                   # Admin panel for coaches
├── firestore.rules          # Firestore security rules
└── README.md
```

## 🔒 Firestore Data Structure

### Collections

- **users**: User profiles, onboarding data, subscription info, stats
- **dailyCheckIns**: Daily check-in records
- **usageData**: Screen time and app usage tracking
- **coachReviews**: Weekly coach feedback and scores

See `types/index.ts` for detailed schema.

## 👥 Admin Panel

The admin panel allows coaches to write weekly reviews for users.

### Setup

1. Deploy the admin panel:

```bash
firebase deploy --only hosting
```

2. Access at: `https://your-project.web.app`

3. Login with an admin account (create manually in Firebase Console)

### Features

- View all active subscribers
- See user stats (streak, check-ins, struggle type)
- Write personalized reviews
- Score breakdown (Goal Achievement, Engagement, Behavior, Bonus)

## 🚢 Deployment

### Deploy to Expo

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

### Deploy Backend

```bash
# Deploy everything
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

## 📊 Monitoring

- **Firebase Console**: Monitor users, check-ins, and reviews
- **Stripe Dashboard**: Track subscriptions and payments
- **Firebase Analytics**: User engagement and retention

## 🧪 Testing

### Test User Flow

1. Run the app: `npm start`
2. Complete onboarding flow
3. Make a daily check-in
4. Use admin panel to write a review
5. View review in the app

### Test Stripe Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 🔐 Security Notes

- Never commit `.env` files to git
- Keep Stripe secret keys in Firebase Functions config only
- Review Firestore security rules before production
- Enable App Check for additional security
- Use HTTPS for all admin panel access

## 📈 Next Steps

1. **Screen Time Integration**: Implement native modules for iOS/Android
2. **Push Notifications**: Set up daily reminders
3. **Advanced Analytics**: Track user behavior patterns
4. **Coach Matching**: Automated coach assignment based on struggle/faith
5. **Community Features**: Optional peer support groups
6. **Gamification**: Badges, achievements, leaderboards

## 🐛 Troubleshooting

### Common Issues

**"Firebase not initialized"**
- Ensure `.env` file exists with correct Firebase config
- Restart the development server

**"Stripe payment fails"**
- Check Stripe publishable key in `.env`
- Verify Firebase Functions are deployed
- Check Functions config has Stripe secret key

**"Expo Go won't load app"**
- Ensure you're on the same network
- Clear Expo cache: `expo start -c`

## 📝 License

MIT

## 🤝 Contributing

This is an MVP. For production:
1. Add comprehensive error handling
2. Implement proper logging
3. Add unit and integration tests
4. Set up CI/CD pipeline
5. Add crash reporting (Sentry)
6. Implement proper analytics

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@yourapp.com

---

**Built with ❤️ for digital accountability and freedom**
