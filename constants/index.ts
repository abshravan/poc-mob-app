// ==========================================
// Solo Level Up - Constants
// ==========================================

export const RANKS: { title: string; minLevel: number; color: string }[] = [
  { title: "E-Rank Hunter", minLevel: 1, color: "#808080" },
  { title: "D-Rank Hunter", minLevel: 5, color: "#2ECC71" },
  { title: "C-Rank Hunter", minLevel: 10, color: "#3498DB" },
  { title: "B-Rank Hunter", minLevel: 20, color: "#9B59B6" },
  { title: "A-Rank Hunter", minLevel: 35, color: "#E67E22" },
  { title: "S-Rank Hunter", minLevel: 50, color: "#E74C3C" },
  { title: "National Level Hunter", minLevel: 75, color: "#F1C40F" },
  { title: "Shadow Monarch", minLevel: 100, color: "#6C5CE7" },
];

export const QUEST_XP_REWARDS: Record<string, number> = {
  E: 10,
  D: 25,
  C: 50,
  B: 100,
  A: 200,
  S: 500,
};

export const QUEST_DIFFICULTY_COLORS: Record<string, string> = {
  E: "#808080",
  D: "#2ECC71",
  C: "#3498DB",
  B: "#9B59B6",
  A: "#E67E22",
  S: "#E74C3C",
};

export const POMODORO_DEFAULTS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  xpPerFocusSession: 15,
};

export const STREAK_MILESTONES = [
  { days: 3, xpBonus: 25 },
  { days: 7, xpBonus: 75 },
  { days: 14, xpBonus: 150 },
  { days: 30, xpBonus: 500 },
  { days: 60, xpBonus: 1000 },
  { days: 100, xpBonus: 2500 },
];

export const STAT_NAMES = {
  strength: "STR",
  intelligence: "INT",
  vitality: "VIT",
  agility: "AGI",
  perception: "PER",
} as const;
