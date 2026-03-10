import { create } from "zustand";
import { supabase } from "@/services/supabase";
import { PomodoroSession, PomodoroSessionType } from "@/types";
import { POMODORO_DEFAULTS } from "@/constants";

type TimerStatus = "idle" | "running" | "paused" | "completed";

type PomodoroState = {
  // Timer state
  timerStatus: TimerStatus;
  sessionType: PomodoroSessionType;
  timeRemaining: number; // in seconds
  sessionsCompleted: number;

  // Settings
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;

  // Session history
  sessions: PomodoroSession[];
  loading: boolean;

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completeSession: (userId: string) => Promise<number>;
  fetchSessions: (userId: string) => Promise<void>;
  updateSettings: (settings: {
    focusDuration?: number;
    shortBreakDuration?: number;
    longBreakDuration?: number;
  }) => void;
};

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  timerStatus: "idle",
  sessionType: "focus",
  timeRemaining: POMODORO_DEFAULTS.focusDuration * 60,
  sessionsCompleted: 0,

  focusDuration: POMODORO_DEFAULTS.focusDuration,
  shortBreakDuration: POMODORO_DEFAULTS.shortBreakDuration,
  longBreakDuration: POMODORO_DEFAULTS.longBreakDuration,

  sessions: [],
  loading: false,

  startTimer: () => {
    set({ timerStatus: "running" });
  },

  pauseTimer: () => {
    set({ timerStatus: "paused" });
  },

  resumeTimer: () => {
    set({ timerStatus: "running" });
  },

  resetTimer: () => {
    const { sessionType, focusDuration, shortBreakDuration, longBreakDuration } = get();
    let duration = focusDuration;
    if (sessionType === "short_break") duration = shortBreakDuration;
    if (sessionType === "long_break") duration = longBreakDuration;

    set({
      timerStatus: "idle",
      timeRemaining: duration * 60,
    });
  },

  tick: () => {
    const { timeRemaining, timerStatus } = get();
    if (timerStatus !== "running") return;
    if (timeRemaining <= 0) {
      set({ timerStatus: "completed" });
      return;
    }
    set({ timeRemaining: timeRemaining - 1 });
  },

  completeSession: async (userId: string) => {
    const {
      sessionType,
      focusDuration,
      shortBreakDuration,
      longBreakDuration,
      sessionsCompleted,
    } = get();

    const isFocus = sessionType === "focus";
    const xpEarned = isFocus ? POMODORO_DEFAULTS.xpPerFocusSession : 0;

    const durationMap: Record<PomodoroSessionType, number> = {
      focus: focusDuration,
      short_break: shortBreakDuration,
      long_break: longBreakDuration,
    };

    // Save session to database
    await supabase.from("pomodoro_sessions").insert({
      user_id: userId,
      session_type: sessionType,
      duration_minutes: durationMap[sessionType],
      xp_earned: xpEarned,
      completed: true,
      completed_at: new Date().toISOString(),
    });

    const newSessionsCompleted = isFocus
      ? sessionsCompleted + 1
      : sessionsCompleted;

    // Determine next session type
    let nextType: PomodoroSessionType;
    if (isFocus) {
      nextType =
        newSessionsCompleted % POMODORO_DEFAULTS.sessionsBeforeLongBreak === 0
          ? "long_break"
          : "short_break";
    } else {
      nextType = "focus";
    }

    const nextDuration = durationMap[nextType] || focusDuration;

    set({
      timerStatus: "idle",
      sessionType: nextType,
      timeRemaining: nextDuration * 60,
      sessionsCompleted: newSessionsCompleted,
    });

    return xpEarned;
  },

  fetchSessions: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from("pomodoro_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      set({ sessions: data || [] });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: (settings) => {
    const state = get();
    const newState: Partial<PomodoroState> = {};

    if (settings.focusDuration) newState.focusDuration = settings.focusDuration;
    if (settings.shortBreakDuration)
      newState.shortBreakDuration = settings.shortBreakDuration;
    if (settings.longBreakDuration)
      newState.longBreakDuration = settings.longBreakDuration;

    // Reset timer if idle
    if (state.timerStatus === "idle") {
      const duration =
        state.sessionType === "focus"
          ? settings.focusDuration || state.focusDuration
          : state.sessionType === "short_break"
          ? settings.shortBreakDuration || state.shortBreakDuration
          : settings.longBreakDuration || state.longBreakDuration;
      newState.timeRemaining = duration * 60;
    }

    set(newState);
  },
}));
