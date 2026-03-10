import { create } from "zustand";
import { supabase } from "@/services/supabase";
import { UserStats } from "@/types";
import { getXpProgress, getRankTitle } from "@/utils/xp";

type StatsState = {
  stats: UserStats | null;
  loading: boolean;

  fetchStats: (userId: string) => Promise<void>;
  addXp: (userId: string, amount: number) => Promise<void>;
  allocateStatPoint: (
    userId: string,
    stat: "strength" | "intelligence" | "vitality" | "agility" | "perception"
  ) => Promise<void>;
};

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: null,
  loading: false,

  fetchStats: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from("stats")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      set({ stats: data });
    } finally {
      set({ loading: false });
    }
  },

  addXp: async (userId: string, amount: number) => {
    const currentStats = get().stats;
    if (!currentStats) return;

    const newTotalXp = currentStats.total_xp + amount;
    const progress = getXpProgress(newTotalXp);
    const leveledUp = progress.level > currentStats.level;
    const statPointsGained = leveledUp
      ? progress.level - currentStats.level
      : 0;

    const rankTitle = getRankTitle(progress.level);

    const { data, error } = await supabase
      .from("stats")
      .update({
        total_xp: newTotalXp,
        current_xp: progress.currentXp,
        level: progress.level,
        stat_points: currentStats.stat_points + statPointsGained * 3,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    // Update rank title on user profile
    if (leveledUp) {
      await supabase
        .from("users")
        .update({ rank_title: rankTitle })
        .eq("id", userId);
    }

    set({ stats: data });
  },

  allocateStatPoint: async (userId: string, stat) => {
    const currentStats = get().stats;
    if (!currentStats || currentStats.stat_points <= 0) return;

    const { data, error } = await supabase
      .from("stats")
      .update({
        [stat]: currentStats[stat] + 1,
        stat_points: currentStats.stat_points - 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    set({ stats: data });
  },
}));
