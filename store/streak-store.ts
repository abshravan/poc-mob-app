import { create } from "zustand";
import { mockDb } from "@/services/mock-data";
import { Streak } from "@/types";
import { STREAK_MILESTONES } from "@/constants";

type StreakState = {
  streak: Streak | null;
  loading: boolean;

  fetchStreak: (userId: string) => Promise<void>;
  recordActivity: (userId: string) => Promise<number>;
};

export const useStreakStore = create<StreakState>((set, get) => ({
  streak: null,
  loading: false,

  fetchStreak: async (_userId: string) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({ streak: { ...mockDb.streak }, loading: false });
  },

  recordActivity: async (_userId: string) => {
    const currentStreak = get().streak;
    if (!currentStreak) return 0;

    const today = new Date().toISOString().split("T")[0];
    const lastActivity = currentStreak.last_activity_date;

    // Already recorded today
    if (lastActivity === today) return 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const isConsecutive = lastActivity === yesterdayStr;
    const newCurrentStreak = isConsecutive
      ? currentStreak.current_streak + 1
      : 1;
    const newLongestStreak = Math.max(
      newCurrentStreak,
      currentStreak.longest_streak
    );

    const updated: Streak = {
      ...currentStreak,
      current_streak: newCurrentStreak,
      longest_streak: newLongestStreak,
      last_activity_date: today,
      updated_at: new Date().toISOString(),
    };

    mockDb.streak = { ...updated };
    set({ streak: updated });

    // Check for streak milestone bonuses
    let bonusXp = 0;
    for (const milestone of STREAK_MILESTONES) {
      if (
        newCurrentStreak === milestone.days &&
        currentStreak.current_streak < milestone.days
      ) {
        bonusXp = milestone.xpBonus;
        break;
      }
    }

    return bonusXp;
  },
}));
