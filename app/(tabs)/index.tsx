import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useStatsStore } from "@/store/stats-store";
import { useQuestStore } from "@/store/quest-store";
import { useStreakStore } from "@/store/streak-store";
import { usePomodoroStore } from "@/store/pomodoro-store";
import { XpBar } from "@/components/ui/XpBar";
import { getXpProgress, getRankTitle, getRankColor } from "@/utils/xp";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { stats, fetchStats } = useStatsStore();
  const { quests, fetchQuests } = useQuestStore();
  const { streak, fetchStreak } = useStreakStore();
  const { sessions, fetchSessions } = usePomodoroStore();

  useEffect(() => {
    if (user) {
      fetchStats(user.id);
      fetchQuests(user.id);
      fetchStreak(user.id);
      fetchSessions(user.id);
    }
  }, [user]);

  const xpProgress = stats ? getXpProgress(stats.total_xp) : null;
  const rankTitle = stats ? getRankTitle(stats.level) : "E-Rank Hunter";
  const rankColor = stats ? getRankColor(stats.level) : "#808080";
  const activeQuests = quests.filter((q) => q.status === "active");
  const todaysSessions = sessions.filter((s) => {
    if (!s.completed_at) return false;
    const today = new Date().toISOString().split("T")[0];
    return s.completed_at.startsWith(today) && s.session_type === "focus";
  });

  return (
    <ScrollView className="flex-1 bg-surface-dark px-4 pt-4">
      {/* Rank & Level Card */}
      <View className="bg-surface rounded-2xl p-5 mb-4 border border-gray-800">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-gray-400 text-xs uppercase tracking-wider">
              Current Rank
            </Text>
            <Text className="text-xl font-bold" style={{ color: rankColor }}>
              {rankTitle}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xp font-bold text-2xl">
              {stats?.total_xp || 0}
            </Text>
            <Text className="text-gray-400 text-xs">TOTAL XP</Text>
          </View>
        </View>
        {xpProgress && (
          <XpBar
            currentXp={xpProgress.currentXp}
            xpNeeded={xpProgress.xpNeeded}
            level={xpProgress.level}
            percentage={xpProgress.percentage}
          />
        )}
      </View>

      {/* Quick Stats Row */}
      <View className="flex-row mb-4 gap-3">
        <Pressable
          onPress={() => router.push("/(tabs)/quests")}
          className="flex-1 bg-surface rounded-xl p-4 border border-gray-800"
        >
          <Text className="text-accent text-2xl font-bold">
            {activeQuests.length}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">Active Quests</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/timer")}
          className="flex-1 bg-surface rounded-xl p-4 border border-gray-800"
        >
          <Text className="text-primary-light text-2xl font-bold">
            {todaysSessions.length}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">Focus Today</Text>
        </Pressable>

        <View className="flex-1 bg-surface rounded-xl p-4 border border-gray-800">
          <Text className="text-xp text-2xl font-bold">
            {streak?.current_streak || 0}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">Day Streak</Text>
        </View>
      </View>

      {/* Active Quests Preview */}
      <View className="bg-surface rounded-2xl p-4 mb-4 border border-gray-800">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white font-bold text-base">Active Quests</Text>
          <Pressable onPress={() => router.push("/(tabs)/quests")}>
            <Text className="text-primary text-sm">View All</Text>
          </Pressable>
        </View>
        {activeQuests.length === 0 ? (
          <Text className="text-gray-500 text-sm">
            No active quests. Create one to start earning XP!
          </Text>
        ) : (
          activeQuests.slice(0, 3).map((quest) => (
            <View
              key={quest.id}
              className="flex-row items-center justify-between py-2 border-b border-gray-800"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-primary mr-2 font-bold text-sm">
                  [{quest.difficulty}]
                </Text>
                <Text
                  className="text-white text-sm flex-1"
                  numberOfLines={1}
                >
                  {quest.title}
                </Text>
              </View>
              <Text className="text-xp text-xs font-bold">
                +{quest.xp_reward} XP
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Hunter Stats Preview */}
      {stats && (
        <Pressable
          onPress={() => router.push("/(tabs)/stats")}
          className="bg-surface rounded-2xl p-4 mb-8 border border-gray-800"
        >
          <Text className="text-white font-bold text-base mb-3">
            Hunter Stats
          </Text>
          <View className="flex-row justify-between">
            {[
              { label: "STR", value: stats.strength, color: "#E74C3C" },
              { label: "INT", value: stats.intelligence, color: "#3498DB" },
              { label: "VIT", value: stats.vitality, color: "#2ECC71" },
              { label: "AGI", value: stats.agility, color: "#E67E22" },
              { label: "PER", value: stats.perception, color: "#9B59B6" },
            ].map((stat) => (
              <View key={stat.label} className="items-center">
                <View
                  className="w-11 h-11 rounded-lg items-center justify-center"
                  style={{ backgroundColor: stat.color + "20" }}
                >
                  <Text
                    className="font-bold text-base"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </Text>
                </View>
                <Text className="text-gray-500 text-xs mt-1">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
          {stats.stat_points > 0 && (
            <Text className="text-xp text-xs mt-3 text-center">
              {stats.stat_points} stat points available!
            </Text>
          )}
        </Pressable>
      )}
    </ScrollView>
  );
}
