import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmail,
  signUpWithEmail,
  signInWithApple as appleSignIn,
  signOut as firebaseSignOut,
  deleteAccount as firebaseDeleteAccount,
} from "../firebase/auth";
import { deleteUserData } from "../firebase/firestore";
import { identifyUser, logOut as revenueCatLogOut } from "../services/revenueCat";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          await identifyUser(firebaseUser.uid);
        } catch {
          // RevenueCat identify is non-critical
        }
      } else {
        // Clear RevenueCat cache so the next user's getCustomerInfo() cannot
        // return the previous user's subscription data on first load.
        try {
          await revenueCatLogOut();
        } catch {
          // Non-critical
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string): Promise<void> {
    await signInWithEmail(email, password);
  }

  async function signUp(email: string, password: string): Promise<void> {
    await signUpWithEmail(email, password);
  }

  async function signInWithApple(): Promise<void> {
    await appleSignIn();
  }

  async function signOut(): Promise<void> {
    await firebaseSignOut();
  }

  async function deleteAccount(): Promise<void> {
    if (user?.uid) {
      await deleteUserData(user.uid).catch(() => {});
    }
    await firebaseDeleteAccount();
  }

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, signIn, signUp, signInWithApple, signOut, deleteAccount } },
    children,
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
