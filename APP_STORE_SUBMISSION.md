# SafeScan Systems — App Store Submission Guide

This file is the master reference for submitting any SafeScan Systems app to the Apple App Store.
It was built from the ThyraScan submission process and applies to all apps in the family:
ThyraScan, GutScan, PCOScan, and any future apps.

---

## SafeScan Systems App Family

| App | Condition | Bundle ID | Slug |
|-----|-----------|-----------|------|
| ThyraScan | Hashimoto's / Hypothyroidism | `com.thyrascan.app` | `thyrascan` |
| GutScan | IBS / Crohn's / IBD | `com.gutscan.app` | `gutscan` |
| PCOScan | PCOS / Hormonal conditions | `com.pcoscan.app` | `pcoscan` |

Each app follows the same architecture, scoring engine pattern, and submission process below.

---

## Pre-Build Checklist

Before triggering any EAS build:

- [ ] `app.config.ts` has correct `bundleIdentifier` for the app
- [ ] `app.config.ts` has correct `version` and `buildNumber` source set to `local`
- [ ] `eas.json` has `distribution: "store"` on `production` profile
- [ ] `eas.json` has `environment: "production"` on both `preview` and `production` profiles
- [ ] All required EAS environment variables set (see Environment Variables section)
- [ ] `assets/icon.png` is 1024×1024px, no transparency, no rounded corners (Apple applies them)
- [ ] `assets/splash-icon.png` exists and matches brand
- [ ] `.env.local` is in `.gitignore` — never committed
- [ ] RevenueCat iOS key added to EAS as a sensitive env var
- [ ] Firebase config vars added to EAS production environment

---

## EAS Environment Variables Required

Set these via `npx eas env:create --environment production --name KEY --value "value" --type sensitive`:

| Variable | Type | Source |
|----------|------|--------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | plain | Firebase Console → Project Settings → Web app |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | plain | Firebase Console |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | plain | Firebase Console |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | plain | Firebase Console |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | plain | Firebase Console |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | plain | Firebase Console |
| `REVENUECAT_API_KEY_IOS` | sensitive | RevenueCat → Apps & providers → API Keys → SDK (iOS) |
| `EAS_PROJECT_ID` | plain | expo.dev project dashboard |

Verify all are set:
```bash
npx eas env:list --environment production
```

---

## Build Commands

```bash
# Internal preview build (TestFlight-style, for team testing)
npx eas build --platform ios --profile preview

# Production App Store build
npx eas build --platform ios --profile production

# Check build status
npx eas build:list --platform ios --limit 5
```

Builds take approximately 15–25 minutes on EAS servers.
After a production build completes, it appears in App Store Connect → TestFlight automatically.

---

## App Store Connect Setup (per app)

### 1. Create the App Record

1. Go to [App Store Connect](https://appstoreconnect.apple.com) → My Apps → **+**
2. Platform: **iOS**
3. Name: e.g. `ThyraScan`
4. Primary Language: **English (U.S.)**
5. Bundle ID: select from list (must match `app.config.ts`)
6. SKU: e.g. `thyrascan_ios_v1` (internal, never shown to users)
7. User Access: **Full Access**

### 2. App Information (left sidebar)

- **Category**: Health & Fitness
- **Subcategory**: leave blank or Food & Drink
- **Privacy Policy URL**: must be live before submission (e.g. `https://thyrascan.app/privacy`)
- **Age Rating**: complete questionnaire (all SafeScan apps are 4+)

### 3. Age Rating Questionnaire

All SafeScan apps answer the same way:

| Feature | Answer |
|---------|--------|
| Parental Controls | No |
| Age Assurance | No |
| Unrestricted Web Access | No |
| User-Generated Content | No |
| Messaging and Chat | No |
| Advertising | No |
| Medical or Treatment Information | **None** |
| Health or Wellness Topics | **Yes** |

Result: **4+**

### 4. App Privacy (Data Collection)

All SafeScan apps collect the same data. Select **Yes, we collect data**, then check:

| Data Type | Usage | Linked to Identity | Tracking |
|-----------|-------|-------------------|---------|
| Email Address | App Functionality | Yes | No |
| User ID | App Functionality | Yes | No |
| Purchases | App Functionality | Yes | No |
| Product Interaction | App Functionality | Yes | No |

All other categories: **unchecked**.
No data is used for tracking, advertising, or shared with data brokers.

### 5. Pricing and Availability

- Price: **Free**
- Availability: **All Countries and Regions**
- Apple Silicon Mac: ✅ Make available
- Apple Vision Pro: ❌ Do not make available
- Distribution: **Public**

### 6. In-App Purchase / Subscription

Create under **Monetization → Subscriptions**:

| Field | Value |
|-------|-------|
| Reference Name | `[AppName] Premium Monthly` |
| Product ID | `[appslug]_premium_monthly` (e.g. `thyrascan_premium_monthly`) |
| Price | $4.99/month USD |
| Family Sharing | On |
| Display Name | `[AppName] Premium` |
| Description | `Unlock unlimited scans, full ingredient breakdowns, and complete scan history. Includes a 7-day free trial.` |
| Review Screenshot | Paywall screen screenshot |
| Review Notes | See template below |

**Review Notes template:**
```
This subscription unlocks unlimited barcode scans and full ingredient breakdowns.
To test, use a sandbox Apple ID. The paywall appears after the free scan limit is
reached or via the Profile screen → Upgrade to Premium.
```

Also create an **Entitlement** in RevenueCat named `premium` and link the product ID.

### 7. Version Page — Required Fields

| Field | Value |
|-------|-------|
| Subtitle | `[Condition]-Safe Food Scanner` (max 30 chars) |
| Promotional Text | Short tagline, 170 chars max — can update anytime without resubmission |
| Description | See app-specific template below |
| Keywords | See app-specific keywords below |
| Support URL | `https://[appname].app/support` |
| Copyright | `2026 SafeScan Systems` |
| Version | `1.0` |

### 8. Screenshots Required

Minimum required sizes for App Store:
- **6.5" iPhone** (1284×2778px or 1242×2688px) — **required**
- **6.7" iPhone** (1290×2796px) — recommended

Minimum 1 screenshot, recommended 4–6.

Generate from the web preview:
```bash
cd /Users/devancapps/Desktop/SafeScanSystems/[AppName]
# Resize preview to iPhone proportions, capture each key screen, resize to 1284×2778
# See screenshots/ folder after generation
```

Key screens to capture:
1. Welcome / onboarding
2. Scanner active
3. SAFE result
4. AVOID result with ingredient breakdown
5. History / home screen
6. Paywall / premium screen

### 9. App Review Information

| Field | Value |
|-------|-------|
| Sign-in required | Yes |
| Username | Create a test account: `reviewer@[appname].app` |
| Password | A simple password you control |
| First name | Devan |
| Last name | Capps |
| Phone | Your number |
| Email | Your email |

**Review Notes template:**
```
[AppName] uses the camera exclusively for real-time barcode scanning. No photos
are taken or stored. Camera permission is required to scan food product barcodes.

The app includes an in-app subscription ([AppName] Premium, $4.99/month) which
can be tested using a sandbox Apple ID. The free tier allows a limited number of
scans per day.

This app is an educational tool and includes medical disclaimers on every result
screen. It does not provide medical advice or diagnosis.
```

---

## App-Specific Copy Templates

### ThyraScan

**Subtitle:** `Thyroid-Safe Food Scanner`

**Keywords:** `thyroid,hashimoto,hypothyroid,food scanner,goitrogen,ingredient checker,thyroid diet,iodine`

**Description:**
```
ThyraScan helps people managing Hashimoto's thyroiditis and hypothyroidism make
more informed choices about the food they eat.

Simply scan any food barcode and ThyraScan instantly checks the ingredient list
against a curated database of ingredients that current dietary research links to
thyroid disruption — including goitrogens, iodine-containing compounds, soy
derivatives, gluten, and absorption blockers.

WHAT YOU GET:
• Instant barcode scanning — point, scan, get results in seconds
• SAFE / REVIEW / AVOID verdicts based on your specific condition
• Full ingredient breakdown with plain-English explanations
• Condition-aware analysis — Hashimoto's and Hypothyroidism scored differently
• Complete scan history so you can track what you've checked
• Unlimited scans with Premium

IMPORTANT:
ThyraScan is an educational label-literacy tool. It is not a medical device and
does not provide medical advice or diagnosis. Always consult your healthcare
provider before making dietary changes related to your condition.

PREMIUM:
Upgrade to ThyraScan Premium for $4.99/month to unlock unlimited scans. A 7-day
free trial is included.
```

### GutScan (template — update when building)

**Subtitle:** `Gut-Safe Food Scanner` (25 chars)

**Keywords:** `IBS,gut health,food scanner,crohn's,IBD,FODMAP,ingredient checker,digestive`

### PCOScan (template — update when building)

**Subtitle:** `PCOS-Safe Food Scanner` (22 chars)

**Keywords:** `PCOS,hormones,food scanner,insulin,endocrine,ingredient checker,hormone diet`

---

## Submit for Review

After all fields are filled and a build is linked:

1. Go to version page → click **Add for Review**
2. Confirm export compliance:
   - Uses encryption: **No** (Firebase uses standard HTTPS — covered by Apple's exemption)
   - `ITSAppUsesNonExemptEncryption: false` is already set in `app.config.ts`
3. Click **Submit to App Review**

Typical review time: 24–72 hours for new apps.

---

## Post-Approval

1. App is approved → release **manually** or **automatically**
2. Swap RevenueCat `test_` key to production `appl_` key in EAS:
   ```bash
   npx eas env:create --environment production \
     --name REVENUECAT_API_KEY_IOS \
     --value "appl_XXXXXX" \
     --type sensitive \
     --force
   ```
3. Run a new production build with the production key
4. Submit the new build to App Store without review (just a binary update)

---

## RevenueCat Setup (per app)

1. RevenueCat Dashboard → **+ New Project** → name it `[AppName]`
2. **Apps & providers → + New App** → App Store → enter bundle ID
3. **API Keys** → copy the SDK (public) key → add to EAS
4. **Product catalog → Products** → add product ID (e.g. `thyrascan_premium_monthly`)
5. **Entitlements** → create entitlement named `premium` → attach product
6. **Offerings** → create default offering → add package → attach entitlement

---

## Common Rejection Reasons to Avoid

| Reason | Prevention |
|--------|-----------|
| Medical claims | Never say "safe for [condition]" — always say "educational purposes only" |
| Missing disclaimer | Disclaimer must appear on every result screen, paywall, and disclaimer screen |
| Broken sign-in for reviewer | Always test reviewer credentials before submitting |
| Missing privacy policy | Must be a live URL before submitting |
| Screenshots don't match app | Regenerate screenshots from current build before submission |
| In-app purchase not linked | Must link IAP to version page before hitting Add for Review |
| Camera permission string missing | Already set in `app.config.ts` — don't remove it |

---

## Related Documents

- `SECRETS_SETUP.md` — Firebase, RevenueCat, and EAS secrets setup
- `TECHNICAL_ARCHITECTURE.md` — Full system design and data models
- `CLAUDE.md` — Codebase conventions and architecture rules
