import { create } from "zustand";
import { supabase } from "@/services/supabase";
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

  fetchStreak: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      set({ streak: data });
    } finally {
      set({ loading: false });
    }
  },

  recordActivity: async (userId: string) => {
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

    const { data, error } = await supabase
      .from("streaks")
      .update({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    set({ streak: data });

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
