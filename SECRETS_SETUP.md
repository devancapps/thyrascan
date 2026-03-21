# ThyraScan — Secrets Setup Guide

All sensitive credentials are managed via **EAS Secrets** and a local `.env.local` file.
They are never committed to git.

---

## 1. Firebase Setup

### Create a new Firebase project for ThyraScan

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project: **thyrascan** (or similar)
3. Enable **Authentication** → Sign-in methods → Email/Password + Apple
4. Enable **Firestore Database** → Start in production mode
5. Add a **Web app** to the project to get config values
6. Copy the config values into `.env.local` and run the EAS Secrets commands below

### Configure Apple Sign In in Firebase
- In Firebase Auth → Sign-in method → Apple, add your App ID: `com.thyrascan.app`
- Add the OAuth redirect domain that Firebase provides to your Apple Developer account

### Firestore Security Rules
Deploy these rules to protect user data:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /scan_history/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

---

## 2. RevenueCat Setup

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Create a new project: **ThyraScan**
3. Add an **iOS app** with bundle ID `com.thyrascan.app`
4. Copy the **iOS API key** (starts with `appl_`)
5. In App Store Connect, create an **auto-renewable subscription**:
   - Product ID: `thyrascan_premium_monthly`
   - Price: $4.99/month
6. In RevenueCat, link the App Store subscription product
7. Create an **Entitlement** named `premium`

---

## 3. Privacy Policy

The app links to `https://thyrascan.app/privacy`. You need to host a privacy policy at that URL before App Store submission.

Minimum required content:
- What data is collected (email, scan history)
- How data is stored (Firebase/Firestore)
- How to request data deletion
- Contact information

Simple options: GitHub Pages, Notion public page, or any static host.

---

## 4. Register EAS Secrets

After filling in `.env.local`, run these commands once to store secrets in EAS:

```bash
# Install EAS CLI if needed
npm install -g eas-cli
eas login

# Firebase secrets
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_PROJECT_ID --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --value "YOUR_VALUE"
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_APP_ID --value "YOUR_VALUE"

# RevenueCat secrets
eas secret:create --scope project --name REVENUECAT_API_KEY_IOS --value "YOUR_APPL_KEY"
eas secret:create --scope project --name REVENUECAT_API_KEY_ANDROID --value "YOUR_GOOG_KEY"

# EAS Project ID (from expo.dev after eas init)
eas secret:create --scope project --name EAS_PROJECT_ID --value "YOUR_PROJECT_ID"
```

Verify secrets are registered:
```bash
eas secret:list
```

---

## 5. Local Development

For local dev with `expo start`, copy `.env.local` and fill in the values:
```bash
cp .env.local .env.local
# Fill in values, then:
npx expo start
```

---

## 6. Build & Submit

```bash
# Production build
eas build --platform ios --profile production

# Submit to App Store (after build completes)
eas submit --platform ios
```

---

## 7. App Store Connect Checklist

Before submitting:
- [ ] App record created in App Store Connect
- [ ] Bundle ID `com.thyrascan.app` registered
- [ ] In-app purchase created (`thyrascan_premium_monthly`, $4.99/mo)
- [ ] App screenshots uploaded (6.7" and 6.1" required)
- [ ] App description and keywords filled in
- [ ] Age rating questionnaire completed (likely 4+)
- [ ] Privacy policy URL set: `https://thyrascan.app/privacy`
- [ ] Support URL set
- [ ] Review notes added (mention camera permission use)
