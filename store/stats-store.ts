import { create } from "zustand";
import { mockDb } from "@/services/mock-data";
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

  fetchStats: async (_userId: string) => {
    set({ loading: true });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 200));
    set({ stats: { ...mockDb.stats }, loading: false });
  },

  addXp: async (_userId: string, amount: number) => {
    const currentStats = get().stats;
    if (!currentStats) return;

    const newTotalXp = currentStats.total_xp + amount;
    const progress = getXpProgress(newTotalXp);
    const leveledUp = progress.level > currentStats.level;
    const statPointsGained = leveledUp
      ? progress.level - currentStats.level
      : 0;

    const updated: UserStats = {
      ...currentStats,
      total_xp: newTotalXp,
      current_xp: progress.currentXp,
      level: progress.level,
      stat_points: currentStats.stat_points + statPointsGained * 3,
      updated_at: new Date().toISOString(),
    };

    // Sync back to mock db
    mockDb.stats = { ...updated };
    set({ stats: updated });
  },

  allocateStatPoint: async (_userId: string, stat) => {
    const currentStats = get().stats;
    if (!currentStats || currentStats.stat_points <= 0) return;

    const updated: UserStats = {
      ...currentStats,
      [stat]: currentStats[stat] + 1,
      stat_points: currentStats.stat_points - 1,
      updated_at: new Date().toISOString(),
    };

    mockDb.stats = { ...updated };
    set({ stats: updated });
  },
}));
