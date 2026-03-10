import { Quest, UserStats, Streak, PomodoroSession } from "@/types";

// ==========================================
// Mock Database — In-memory storage
// ==========================================

const MOCK_USER_ID = "mock-user-001";

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// --- Seed Data ---

const seedQuests: Quest[] = [
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    title: "Read 20 pages of a programming book",
    description: "Level up your knowledge by reading daily",
    difficulty: "D",
    xp_reward: 25,
    status: "active",
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    title: "Complete 3 Pomodoro focus sessions",
    description: "Stay focused and earn bonus XP",
    difficulty: "C",
    xp_reward: 50,
    status: "active",
    due_date: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    title: "Morning workout — 30 min",
    description: "Strength training or cardio",
    difficulty: "B",
    xp_reward: 100,
    status: "active",
    due_date: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    title: "Meditate for 10 minutes",
    description: "Clear your mind, hunter",
    difficulty: "E",
    xp_reward: 10,
    status: "active",
    due_date: null,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    updated_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    title: "Ship a feature to production",
    description: "Deploy code that passes all tests",
    difficulty: "A",
    xp_reward: 200,
    status: "active",
    due_date: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    title: "Review pull requests",
    description: null,
    difficulty: "D",
    xp_reward: 25,
    status: "completed",
    due_date: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    title: "Write unit tests for auth module",
    description: null,
    difficulty: "C",
    xp_reward: 50,
    status: "completed",
    due_date: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

const seedStats: UserStats = {
  id: uuid(),
  user_id: MOCK_USER_ID,
  level: 7,
  current_xp: 120,
  total_xp: 2370,
  strength: 5,
  intelligence: 8,
  vitality: 4,
  agility: 3,
  perception: 6,
  stat_points: 3,
  created_at: new Date(Date.now() - 604800000).toISOString(),
  updated_at: new Date().toISOString(),
};

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const seedStreak: Streak = {
  id: uuid(),
  user_id: MOCK_USER_ID,
  current_streak: 5,
  longest_streak: 12,
  last_activity_date: yesterday.toISOString().split("T")[0],
  updated_at: new Date().toISOString(),
};

const todayStr = new Date().toISOString();
const seedPomodoroSessions: PomodoroSession[] = [
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    session_type: "focus",
    duration_minutes: 25,
    xp_earned: 15,
    completed: true,
    started_at: new Date(Date.now() - 7200000).toISOString(),
    completed_at: new Date(Date.now() - 5700000).toISOString(),
  },
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    session_type: "short_break",
    duration_minutes: 5,
    xp_earned: 0,
    completed: true,
    started_at: new Date(Date.now() - 5700000).toISOString(),
    completed_at: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    session_type: "focus",
    duration_minutes: 25,
    xp_earned: 15,
    completed: true,
    started_at: new Date(Date.now() - 5400000).toISOString(),
    completed_at: new Date(Date.now() - 3900000).toISOString(),
  },
  {
    id: uuid(),
    user_id: MOCK_USER_ID,
    session_type: "focus",
    duration_minutes: 25,
    xp_earned: 15,
    completed: true,
    started_at: new Date(Date.now() - 90000000).toISOString(),
    completed_at: new Date(Date.now() - 88500000).toISOString(),
  },
];

// ==========================================
// In-memory Mock DB
// ==========================================

export const mockDb = {
  userId: MOCK_USER_ID,
  username: "ShadowHunter",
  email: "hunter@solo.dev",

  quests: [...seedQuests],
  stats: { ...seedStats },
  streak: { ...seedStreak },
  pomodoroSessions: [...seedPomodoroSessions],

  uuid,
};
