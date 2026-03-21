import { getDailyScanCount, incrementScanCount } from "../firebase/firestore";

export const FREE_SCAN_LIMIT = 5;

export async function canUserScan(
  userId: string,
  isPremium: boolean,
): Promise<boolean> {
  if (isPremium) return true;
  const count = await getDailyScanCount(userId);
  return count < FREE_SCAN_LIMIT;
}

export async function getRemainingScans(
  userId: string,
  isPremium: boolean,
): Promise<number> {
  if (isPremium) return -1;
  const count = await getDailyScanCount(userId);
  return Math.max(0, FREE_SCAN_LIMIT - count);
}

export async function recordScan(userId: string): Promise<void> {
  await incrementScanCount(userId);
}
