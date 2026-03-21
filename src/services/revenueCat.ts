import Purchases, { LOG_LEVEL, PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

let configured = false;
let configurePromise: Promise<void> | null = null;

export function initRevenueCat(): Promise<void> {
  if (configurePromise) return configurePromise;

  configurePromise = (async () => {
    const apiKey =
      Platform.OS === "ios"
        ? extra.revenueCatApiKeyIos
        : extra.revenueCatApiKeyAndroid;

    if (!apiKey) {
      console.warn("RevenueCat API key not configured");
      return;
    }

    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    Purchases.configure({ apiKey });
    configured = true;
  })();

  return configurePromise;
}

async function waitForSDK(): Promise<boolean> {
  if (configured) return true;
  if (configurePromise) {
    await configurePromise;
    return configured;
  }
  return false;
}

export async function identifyUser(userId: string): Promise<void> {
  try {
    if (!(await waitForSDK())) return;
    await Purchases.logIn(userId);
  } catch (e) {
    console.warn("RevenueCat identify failed:", e);
  }
}

/**
 * Clears RevenueCat's cached user and subscription data. Must be called when the
 * user signs out so that the next user's getCustomerInfo() cannot return the
 * previous user's cached data.
 */
export async function logOut(): Promise<void> {
  try {
    if (!(await waitForSDK())) return;
    await Purchases.logOut();
  } catch (e) {
    console.warn("RevenueCat logOut failed:", e);
  }
}

function isPremiumCustomer(
  customerInfo: Awaited<ReturnType<typeof Purchases.getCustomerInfo>>,
): boolean {
  const hasEntitlement =
    Object.keys(customerInfo.entitlements.active).length > 0;
  const hasSubscription = customerInfo.activeSubscriptions.length > 0;
  if (__DEV__) {
    console.log("[RevenueCat] entitlements:", customerInfo.entitlements.active);
    console.log(
      "[RevenueCat] activeSubscriptions:",
      customerInfo.activeSubscriptions,
    );
  }
  return hasEntitlement || hasSubscription;
}

/**
 * Returns whether the current RevenueCat user has an active subscription.
 * @param expectedUserId - If provided, we only trust the result when the SDK's
 * current app user ID equals expectedUserId (defensive against stale cache from
 * a previous user). We use getAppUserID() rather than customerInfo.originalAppUserId
 * because after logIn(userId), RevenueCat may alias identities so originalAppUserId
 * can be the user's original/anonymous ID, not the one we passed — the subscription
 * is still for the current user.
 */
export async function checkSubscriptionStatus(
  expectedUserId?: string,
): Promise<boolean> {
  try {
    if (!(await waitForSDK())) return false;
    if (expectedUserId != null) {
      const currentAppUserId = await Purchases.getAppUserID();
      if (currentAppUserId !== expectedUserId) {
        if (__DEV__) {
          console.warn(
            "[RevenueCat] Ignoring customerInfo: SDK user",
            currentAppUserId,
            "!= expected",
            expectedUserId,
          );
        }
        return false;
      }
    }
    const customerInfo = await Purchases.getCustomerInfo();
    return isPremiumCustomer(customerInfo);
  } catch {
    return false;
  }
}

export async function getOfferings(): Promise<PurchasesPackage | null> {
  try {
    if (!(await waitForSDK())) return null;
    const offerings = await Purchases.getOfferings();
    return offerings.current?.monthly ?? null;
  } catch {
    return null;
  }
}

export async function purchaseSubscription(): Promise<boolean> {
  if (!(await waitForSDK())) {
    throw new Error("RevenueCat is not configured");
  }

  const offerings = await Purchases.getOfferings();
  const monthlyPackage = offerings.current?.monthly;

  if (!monthlyPackage) {
    throw new Error("No subscription package available");
  }

  const { customerInfo } = await Purchases.purchasePackage(monthlyPackage);
  return isPremiumCustomer(customerInfo);
}

export async function restorePurchases(): Promise<boolean> {
  if (!(await waitForSDK())) {
    throw new Error("RevenueCat is not configured");
  }
  const customerInfo = await Purchases.restorePurchases();
  return isPremiumCustomer(customerInfo);
}
