import { useState, useEffect, useCallback } from "react";
import {
  FREE_SCAN_LIMIT,
  canUserScan,
  getRemainingScans,
  recordScan,
} from "../logic/scanLimiter";

interface UseScanLimitReturn {
  canScan: boolean;
  remainingScans: number;
  loading: boolean;
  recordScan: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useScanLimit(
  userId: string | undefined,
  isPremium: boolean,
): UseScanLimitReturn {
  const [canScan, setCanScan] = useState(true);
  const [remainingScans, setRemainingScans] = useState(FREE_SCAN_LIMIT);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    if (isPremium) {
      setCanScan(true);
      setRemainingScans(-1);
      setLoading(false);
      return;
    }
    try {
      const [allowed, remaining] = await Promise.all([
        canUserScan(userId, isPremium),
        getRemainingScans(userId, isPremium),
      ]);
      setCanScan(allowed);
      setRemainingScans(remaining);
    } catch {
      setCanScan(true);
    } finally {
      setLoading(false);
    }
  }, [userId, isPremium]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleRecordScan(): Promise<void> {
    if (!userId) return;
    await recordScan(userId);
    await refresh();
  }

  return {
    canScan,
    remainingScans,
    loading,
    recordScan: handleRecordScan,
    refresh,
  };
}
