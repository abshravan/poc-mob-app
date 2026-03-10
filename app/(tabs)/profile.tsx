import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useAuthStore } from "@/store/auth-store";
import { useStatsStore } from "@/store/stats-store";
import { useStreakStore } from "@/store/streak-store";
import { usePomodoroStore } from "@/store/pomodoro-store";
import { useQuestStore } from "@/store/quest-store";
import { getRankTitle, getRankColor } from "@/utils/xp";

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { stats, fetchStats } = useStatsStore();
  const { streak, fetchStreak } = useStreakStore();
  const { sessions, fetchSessions } = usePomodoroStore();
  const { quests, fetchQuests } = useQuestStore();

  useEffect(() => {
    if (user) {
      fetchStats(user.id);
      fetchStreak(user.id);
      fetchSessions(user.id);
      fetchQuests(user.id);
    }
  }, [user]);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to leave?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  const rankTitle = stats ? getRankTitle(stats.level) : "E-Rank Hunter";
  const rankColor = stats ? getRankColor(stats.level) : "#808080";
  const completedQuests = quests.filter((q) => q.status === "completed").length;
  const focusSessions = sessions.filter(
    (s) => s.session_type === "focus" && s.completed
  ).length;
  const totalFocusMinutes = sessions
    .filter((s) => s.session_type === "focus" && s.completed)
    .reduce((sum, s) => sum + s.duration_minutes, 0);

  return (
    <ScrollView className="flex-1 bg-surface-dark px-4 pt-4">
      {/* Profile Card */}
      <View className="bg-surface rounded-2xl p-6 mb-4 border border-gray-800 items-center">
        <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-3 border-2 border-primary">
          <Text className="text-3xl">⚔️</Text>
        </View>
        <Text className="text-white text-xl font-bold">
          {user?.user_metadata?.username || "Hunter"}
        </Text>
        <Text className="text-lg font-bold mt-1" style={{ color: rankColor }}>
          {rankTitle}
        </Text>
        <Text className="text-gray-400 text-sm mt-1">{user?.email}</Text>
        <View className="flex-row mt-4 gap-6">
          <View className="items-center">
            <Text className="text-xp text-xl font-bold">
              {stats?.level || 1}
            </Text>
            <Text className="text-gray-500 text-xs">Level</Text>
          </View>
          <View className="items-center">
            <Text className="text-accent text-xl font-bold">
              {stats?.total_xp || 0}
            </Text>
            <Text className="text-gray-500 text-xs">Total XP</Text>
          </View>
        </View>
      </View>

      {/* Activity Stats */}
      <View className="bg-surface rounded-2xl p-5 mb-4 border border-gray-800">
        <Text className="text-white font-bold text-base mb-4">
          Activity Overview
        </Text>
        <View className="gap-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Quests Completed</Text>
            <Text className="text-white font-bold">{completedQuests}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Focus Sessions</Text>
            <Text className="text-white font-bold">{focusSessions}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Total Focus Time</Text>
            <Text className="text-white font-bold">
              {Math.floor(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Current Streak</Text>
            <Text className="text-xp font-bold">
              {streak?.current_streak || 0} days
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Longest Streak</Text>
            <Text className="text-white font-bold">
              {streak?.longest_streak || 0} days
            </Text>
          </View>
        </View>
      </View>

      {/* Sign Out */}
      <Pressable
        onPress={handleSignOut}
        className="bg-danger/10 rounded-xl py-4 items-center mb-8 border border-danger/30"
      >
        <Text className="text-danger font-bold">Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}
