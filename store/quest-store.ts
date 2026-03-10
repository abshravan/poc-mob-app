import { create } from "zustand";
import { mockDb } from "@/services/mock-data";
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

  fetchQuests: async (_userId: string) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 200));
    set({ quests: [...mockDb.quests], loading: false });
  },

  createQuest: async (userId, quest) => {
    const xpReward = QUEST_XP_REWARDS[quest.difficulty] || 10;
    const now = new Date().toISOString();
    const newQuest: Quest = {
      id: mockDb.uuid(),
      user_id: userId,
      title: quest.title,
      description: quest.description || null,
      difficulty: quest.difficulty,
      xp_reward: xpReward,
      status: "active",
      due_date: quest.due_date || null,
      created_at: now,
      updated_at: now,
    };

    mockDb.quests.unshift(newQuest);
    set({ quests: [...mockDb.quests] });
  },

  completeQuest: async (questId: string, _userId: string) => {
    const quest = get().quests.find((q) => q.id === questId);
    if (!quest) return 0;

    // Update in mock db
    const idx = mockDb.quests.findIndex((q) => q.id === questId);
    if (idx !== -1) {
      mockDb.quests[idx] = {
        ...mockDb.quests[idx],
        status: "completed",
        updated_at: new Date().toISOString(),
      };
    }

    set({ quests: [...mockDb.quests] });
    return quest.xp_reward;
  },

  deleteQuest: async (questId: string) => {
    mockDb.quests = mockDb.quests.filter((q) => q.id !== questId);
    set({ quests: [...mockDb.quests] });
  },
}));
