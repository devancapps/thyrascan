import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { MatchedIngredient, UserCondition } from "../types";

function getUTCDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── User profile ─────────────────────────────────────────────────────────────

export async function createUserProfile(
  userId: string,
  email: string,
): Promise<void> {
  const userRef = doc(db, "users", userId);
  const existing = await getDoc(userRef);
  if (existing.exists()) return;

  await setDoc(userRef, {
    id: userId,
    email,
    condition: null,
    subscription_status: "free",
    created_at: Timestamp.now(),
    daily_scans: { date: getUTCDateString(), count: 0 },
    onboarding_completed: false,
  });
}

export async function getUserProfile(
  userId: string,
): Promise<Record<string, unknown> | null> {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) return null;
  return userDoc.data();
}

export async function setUserCondition(
  userId: string,
  condition: UserCondition,
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { condition }, { merge: true });
}

export async function markOnboardingComplete(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { onboarding_completed: true }, { merge: true });
}

// ─── Scan limits ──────────────────────────────────────────────────────────────

export async function getDailyScanCount(userId: string): Promise<number> {
  const today = getUTCDateString();
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) return 0;

  const data = userDoc.data();
  if (data.daily_scans?.date === today) {
    return data.daily_scans.count ?? 0;
  }
  return 0;
}

export async function incrementScanCount(userId: string): Promise<void> {
  const today = getUTCDateString();
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  let count = 1;
  if (userDoc.exists()) {
    const data = userDoc.data();
    if (data.daily_scans?.date === today) {
      count = (data.daily_scans.count ?? 0) + 1;
    }
  }

  await setDoc(userRef, { daily_scans: { date: today, count } }, { merge: true });
}

// ─── Scan history ─────────────────────────────────────────────────────────────

export async function saveScanResult(
  userId: string,
  result: {
    productName: string;
    barcode: string;
    verdict: string;
    matchedIngredients: MatchedIngredient[];
    condition: UserCondition;
    medicationWarning: boolean;
  },
): Promise<void> {
  await addDoc(collection(db, "scan_history"), {
    user_id: userId,
    product_name: result.productName,
    barcode: result.barcode,
    verdict: result.verdict,
    matched_ingredients: result.matchedIngredients.map((i) => ({
      id: i.entryId,
      displayName: i.displayName,
      category: i.category,
      severity: i.severity,
    })),
    medication_warning: result.medicationWarning,
    condition_at_scan: result.condition,
    scanned_at: Timestamp.now(),
  });
}

export async function deleteUserData(userId: string): Promise<void> {
  await deleteDoc(doc(db, "users", userId));

  const q = query(collection(db, "scan_history"), where("user_id", "==", userId));
  const snapshot = await getDocs(q);
  await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
}

export async function getScanHistory(
  userId: string,
): Promise<Array<Record<string, unknown>>> {
  const q = query(
    collection(db, "scan_history"),
    where("user_id", "==", userId),
  );
  const snapshot = await getDocs(q);
  const docs: Array<Record<string, unknown>> = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
  return docs.sort((a, b) => {
    const aSeconds = (a.scanned_at as { seconds: number } | undefined)?.seconds ?? 0;
    const bSeconds = (b.scanned_at as { seconds: number } | undefined)?.seconds ?? 0;
    return bSeconds - aSeconds;
  });
}
