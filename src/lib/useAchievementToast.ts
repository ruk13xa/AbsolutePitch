import { useCallback, useState } from "react";
import { checkAchievements, type Achievement } from "@/lib/achievements";

/** Re-checks achievements and surfaces the first newly-unlocked one as a toast. */
export function useAchievementToast() {
  const [toast, setToast] = useState<Achievement | null>(null);

  const triggerCheck = useCallback(() => {
    const { newlyUnlocked } = checkAchievements();
    if (newlyUnlocked.length > 0) {
      setToast(newlyUnlocked[0]);
      window.setTimeout(() => setToast(null), 3500);
    }
  }, []);

  return { toast, triggerCheck };
}
