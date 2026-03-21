import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { UserCondition } from "../types";
import {
  getUserProfile,
  setUserCondition as firestoreSetCondition,
  markOnboardingComplete as firestoreMarkOnboarding,
} from "../firebase/firestore";
import { useAuth } from "./useAuth";

interface UserProfileContextType {
  condition: UserCondition | null;
  onboardingCompleted: boolean;
  loading: boolean;
  setCondition: (condition: UserCondition) => Promise<void>;
  markOnboardingComplete: () => Promise<void>;
  refresh: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [condition, setConditionState] = useState<UserCondition | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.uid) {
      setConditionState(null);
      setOnboardingCompleted(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setConditionState((profile.condition as UserCondition) ?? null);
        setOnboardingCompleted((profile.onboarding_completed as boolean) ?? false);
      }
    } catch {
      // Non-critical — default to no condition / onboarding not complete
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function setCondition(newCondition: UserCondition): Promise<void> {
    if (!user?.uid) return;
    setConditionState(newCondition);
    await firestoreSetCondition(user.uid, newCondition);
  }

  async function markOnboardingComplete(): Promise<void> {
    if (!user?.uid) return;
    setOnboardingCompleted(true);
    await firestoreMarkOnboarding(user.uid);
  }

  return React.createElement(
    UserProfileContext.Provider,
    {
      value: {
        condition,
        onboardingCompleted,
        loading,
        setCondition,
        markOnboardingComplete,
        refresh,
      },
    },
    children,
  );
}

export function useUserProfile(): UserProfileContextType {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
