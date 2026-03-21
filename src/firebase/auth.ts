import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  deleteUser,
  User,
} from "firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { firebaseAuth } from "./config";
import { createUserProfile } from "./firestore";

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return credential.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  await createUserProfile(credential.user.uid, email);
  return credential.user;
}

export async function signInWithApple(): Promise<User> {
  const rawNonce = generateNonce(32);
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!appleCredential.identityToken) {
    throw new Error("Apple Sign In failed — no identity token received.");
  }

  const provider = new OAuthProvider("apple.com");
  const oAuthCredential = provider.credential({
    idToken: appleCredential.identityToken,
    rawNonce,
  });

  const result = await signInWithCredential(firebaseAuth, oAuthCredential);
  const email =
    appleCredential.email ?? result.user.email ?? "apple-user@private.com";
  await createUserProfile(result.user.uid, email);
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(firebaseAuth);
}

export async function deleteAccount(): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("No authenticated user");
  await deleteUser(user);
}

export function getCurrentUser(): User | null {
  return firebaseAuth.currentUser;
}

export function onAuthStateChanged(
  callback: (user: User | null) => void,
): () => void {
  return firebaseOnAuthStateChanged(firebaseAuth, callback);
}

function generateNonce(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomBytes = Crypto.getRandomBytes(length);
  return Array.from(randomBytes)
    .map((b) => chars[b % chars.length])
    .join("");
}
