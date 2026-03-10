import { create } from "zustand";
import { supabase } from "@/services/supabase";
import { Quest, QuestDifficulty } from "@/types";
import { QUEST_XP_REWARDS } from "@/constants";

type QuestState = {
  quests: Quest[];
  loading: boolean;

  fetchQuests: (userId: string) => Promise<void>;
  createQuest: (
    userId: string,
    quest: {
      title: string;
      description?: string;
      difficulty: QuestDifficulty;
      due_date?: string;
    }
  ) => Promise<void>;
  completeQuest: (questId: string, userId: string) => Promise<number>;
  deleteQuest: (questId: string) => Promise<void>;
};

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  loading: false,

  fetchQuests: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      set({ quests: data || [] });
    } finally {
      set({ loading: false });
    }
  },

  createQuest: async (userId, quest) => {
    const xpReward = QUEST_XP_REWARDS[quest.difficulty] || 10;
    const { data, error } = await supabase
      .from("quests")
      .insert({
        user_id: userId,
        title: quest.title,
        description: quest.description || null,
        difficulty: quest.difficulty,
        xp_reward: xpReward,
        due_date: quest.due_date || null,
      })
      .select()
      .single();

    if (error) throw error;
    set({ quests: [data, ...get().quests] });
  },

  completeQuest: async (questId: string, userId: string) => {
    const quest = get().quests.find((q) => q.id === questId);
    if (!quest) return 0;

    // Update quest status
    const { error: updateError } = await supabase
      .from("quests")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", questId);
    if (updateError) throw updateError;

    // Record completion
    const { error: completionError } = await supabase
      .from("quest_completions")
      .insert({
        quest_id: questId,
        user_id: userId,
        xp_earned: quest.xp_reward,
      });
    if (completionError) throw completionError;

    // Update local state
    set({
      quests: get().quests.map((q) =>
        q.id === questId ? { ...q, status: "completed" as const } : q
      ),
    });

    return quest.xp_reward;
  },

  deleteQuest: async (questId: string) => {
    const { error } = await supabase
      .from("quests")
      .delete()
      .eq("id", questId);
    if (error) throw error;
    set({ quests: get().quests.filter((q) => q.id !== questId) });
  },
}));
