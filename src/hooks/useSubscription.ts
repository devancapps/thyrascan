import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  checkSubscriptionStatus,
  identifyUser,
  purchaseSubscription as purchase,
  restorePurchases as restore,
} from "../services/revenueCat";
import { useAuth } from "./useAuth";

// DEV ONLY: Set to true to simulate a premium account. Must be false before App Store submission.
const FORCE_PREMIUM = false;

interface SubscriptionContextType {
  isPremium: boolean;
  loading: boolean;
  /** Set only after we've loaded and validated subscription for this user; null when logged out or not yet loaded. */
  loadedForUserId: string | null;
  purchase: () => Promise<boolean>;
  restore: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null);
  const { loading: authLoading, user } = useAuth();
  const userIdRef = useRef<string | null>(null);
  userIdRef.current = user?.uid ?? null;
  const lastLoadedUserIdRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    if (FORCE_PREMIUM) {
      setIsPremium(true);
      setLoading(false);
      return;
    }
    const requestUserId = userIdRef.current;
    const isBackgroundRefresh =
      requestUserId != null && lastLoadedUserIdRef.current === requestUserId;
    if (!isBackgroundRefresh) {
      setLoading(true);
    }
    // Yield so React can commit and paint the loader before we potentially
    // set loading false (RevenueCat can return cached result in same tick).
    await new Promise((r) => setTimeout(r, 0));
    // Ensure RevenueCat has this user before fetching. Auth may have failed to
    // identify (e.g. network), and getCustomerInfo() can return cached previous user.
    if (requestUserId) {
      await identifyUser(requestUserId);
    }
    try {
      const status = await checkSubscriptionStatus(requestUserId ?? undefined);
      if (userIdRef.current !== requestUserId) return;
      setIsPremium(status);
    } catch {
      if (userIdRef.current !== requestUserId) return;
      // Non-critical, default to free
    } finally {
      // Only set loading false and mark "loaded for user" after we've fetched
      // and validated (SDK current user matches expected in checkSubscriptionStatus).
      if (userIdRef.current === requestUserId) {
        lastLoadedUserIdRef.current = requestUserId;
        setLoadedForUserId(requestUserId);
        setLoading(false);
      }
    }
  }, []);

  // Refresh whenever the logged-in user changes (including after logout → login as
  // another user). Otherwise we'd keep showing the previous user's premium state.
  // When user logs out, clear subscription state immediately.
  // When user changes (including A → B), clear state first so we never render the
  // previous user's isPremium on the initial paint (authLoading can still be true
  // when we first get user=B, so we'd skip refresh() and show stale state otherwise).
  useEffect(() => {
    if (user == null) {
      lastLoadedUserIdRef.current = null;
      setLoadedForUserId(null);
      setIsPremium(false);
      setLoading(true);
      return;
    }
    // New user (or same user): reset so we never show previous user's premium state
    // on initial render; then load for current user when auth is ready.
    setIsPremium(false);
    setLoading(true);
    setLoadedForUserId(null);
    if (!authLoading) {
      refresh();
    }
  }, [user?.uid, authLoading, refresh]);

  async function handlePurchase(): Promise<boolean> {
    const success = await purchase();
    if (success) setIsPremium(true);
    return success;
  }

  async function handleRestore(): Promise<boolean> {
    const success = await restore();
    if (success) setIsPremium(true);
    return success;
  }

  return React.createElement(
    SubscriptionContext.Provider,
    {
      value: {
        isPremium,
        loading,
        loadedForUserId,
        purchase: handlePurchase,
        restore: handleRestore,
        refresh,
      },
    },
    children,
  );
}

export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
