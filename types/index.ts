// ==========================================
// Solo Level Up - Type Definitions
// ==========================================

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  rank_title: string;
  created_at: string;
  updated_at: string;
};

export type UserStats = {
  id: string;
  user_id: string;
  level: number;
  current_xp: number;
  total_xp: number;
  strength: number;
  intelligence: number;
  vitality: number;
  agility: number;
  perception: number;
  stat_points: number;
  created_at: string;
  updated_at: string;
};

export type QuestDifficulty = "E" | "D" | "C" | "B" | "A" | "S";
export type QuestStatus = "active" | "completed" | "failed" | "expired";

export type Quest = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  difficulty: QuestDifficulty;
  xp_reward: number;
  status: QuestStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type QuestCompletion = {
  id: string;
  quest_id: string;
  user_id: string;
  xp_earned: number;
  completed_at: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  criteria_type: string;
  criteria_value: number;
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
};

export type Streak = {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  updated_at: string;
};

export type PomodoroSessionType = "focus" | "short_break" | "long_break";

export type PomodoroSession = {
  id: string;
  user_id: string;
  session_type: PomodoroSessionType;
  duration_minutes: number;
  xp_earned: number;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
};

export type RankTitle =
  | "E-Rank Hunter"
  | "D-Rank Hunter"
  | "C-Rank Hunter"
  | "B-Rank Hunter"
  | "A-Rank Hunter"
  | "S-Rank Hunter"
  | "National Level Hunter"
  | "Shadow Monarch";
