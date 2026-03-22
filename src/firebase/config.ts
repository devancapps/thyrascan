import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, Auth, Persistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// EXPO_PUBLIC_ vars are inlined by Metro at bundle time — works without a rebuild
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// getReactNativePersistence is resolved at runtime by Metro's react-native
// module condition — not exposed in the browser TS types, so we use require.
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const getReactNativePersistence = (require("firebase/auth") as any)
  .getReactNativePersistence as (storage: typeof AsyncStorage) => Persistence;

// initializeAuth throws if called a second time (e.g. on hot reload),
// so fall back to getAuth if it was already initialized.
let firebaseAuth: Auth;
try {
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  firebaseAuth = getAuth(app);
}

export { firebaseAuth };
export const db = getFirestore(app);

export default app;
