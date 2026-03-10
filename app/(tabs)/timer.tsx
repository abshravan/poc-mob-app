import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useAuthStore } from "@/store/auth-store";
import { usePomodoroStore } from "@/store/pomodoro-store";
import { useStatsStore } from "@/store/stats-store";
import { useStreakStore } from "@/store/streak-store";
import { TimerCircle } from "@/components/ui/TimerCircle";

export default function TimerScreen() {
  const { user } = useAuthStore();
  const {
    timerStatus,
    sessionType,
    timeRemaining,
    sessionsCompleted,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick,
    completeSession,
  } = usePomodoroStore();
  const { addXp } = useStatsStore();
  const { recordActivity } = useStreakStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get total time for the current session type
  const totalTimeMap = {
    focus: focusDuration * 60,
    short_break: shortBreakDuration * 60,
    long_break: longBreakDuration * 60,
  };
  const totalTime = totalTimeMap[sessionType];

  useEffect(() => {
    if (timerStatus === "running") {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerStatus]);

  useEffect(() => {
    if (timerStatus === "completed" && user) {
      handleComplete();
    }
  }, [timerStatus]);

  const handleComplete = async () => {
    if (!user) return;
    try {
      const xpEarned = await completeSession(user.id);
      if (xpEarned > 0) {
        await addXp(user.id, xpEarned);
        const streakBonus = await recordActivity(user.id);
        Alert.alert(
          "Session Complete!",
          `+${xpEarned} XP earned!${
            streakBonus > 0 ? `\n+${streakBonus} XP streak bonus!` : ""
          }\nTime for a break.`
        );
      } else {
        Alert.alert("Break Over!", "Ready for another focus session?");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const getActionButton = () => {
    switch (timerStatus) {
      case "idle":
        return { label: "START", action: startTimer, color: "#6C5CE7" };
      case "running":
        return { label: "PAUSE", action: pauseTimer, color: "#E67E22" };
      case "paused":
        return { label: "RESUME", action: resumeTimer, color: "#2ECC71" };
      default:
        return { label: "START", action: startTimer, color: "#6C5CE7" };
    }
  };

  const actionBtn = getActionButton();
  const isFocus = sessionType === "focus";

  return (
    <View className="flex-1 bg-surface-dark items-center justify-center px-6">
      {/* Session Info */}
      <View className="items-center mb-4">
        <Text
          className="text-lg font-bold uppercase"
          style={{ color: isFocus ? "#6C5CE7" : "#00D2FF" }}
        >
          {sessionType.replace("_", " ")}
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          Session {sessionsCompleted + 1}
        </Text>
      </View>

      {/* Timer */}
      <TimerCircle
        timeRemaining={timeRemaining}
        totalTime={totalTime}
        sessionType={sessionType}
      />

      {/* XP Reward Info */}
      {isFocus && (
        <Text className="text-xp text-sm mb-8">
          +15 XP on completion
        </Text>
      )}

      {/* Controls */}
      <View className="flex-row gap-4">
        <Pressable
          onPress={resetTimer}
          className="w-16 h-16 rounded-full items-center justify-center bg-surface-light border border-gray-800"
        >
          <Text className="text-gray-400 text-xl">↺</Text>
        </Pressable>

        <Pressable
          onPress={actionBtn.action}
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{ backgroundColor: actionBtn.color }}
        >
          <Text className="text-white font-bold text-sm">
            {actionBtn.label}
          </Text>
        </Pressable>

        <View className="w-16 h-16" />
      </View>

      {/* Session Count */}
      <View className="mt-8 flex-row gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                i < sessionsCompleted % 4 ? "#6C5CE7" : "#25253E",
            }}
          />
        ))}
      </View>
      <Text className="text-gray-600 text-xs mt-2">
        {sessionsCompleted} sessions completed
      </Text>
    </View>
  );
}
