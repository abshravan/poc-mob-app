import React, { useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useAuthStore } from "@/store/auth-store";
import { useStatsStore } from "@/store/stats-store";
import { StatBadge } from "@/components/ui/StatBadge";
import { XpBar } from "@/components/ui/XpBar";
import { getXpProgress, getRankTitle, getRankColor } from "@/utils/xp";

const STAT_CONFIG = [
  {
    key: "strength" as const,
    label: "STR",
    color: "#E74C3C",
    desc: "Physical tasks & exercise",
  },
  {
    key: "intelligence" as const,
    label: "INT",
    color: "#3498DB",
    desc: "Learning & problem-solving",
  },
  {
    key: "vitality" as const,
    label: "VIT",
    color: "#2ECC71",
    desc: "Health & endurance",
  },
  {
    key: "agility" as const,
    label: "AGI",
    color: "#E67E22",
    desc: "Speed & efficiency",
  },
  {
    key: "perception" as const,
    label: "PER",
    color: "#9B59B6",
    desc: "Focus & awareness",
  },
];

export default function StatsScreen() {
  const { user } = useAuthStore();
  const { stats, fetchStats, allocateStatPoint } = useStatsStore();

  useEffect(() => {
    if (user) fetchStats(user.id);
  }, [user]);

  if (!stats) {
    return (
      <View className="flex-1 bg-surface-dark items-center justify-center">
        <Text className="text-gray-500">Loading stats...</Text>
      </View>
    );
  }

  const xpProgress = getXpProgress(stats.total_xp);
  const rankTitle = getRankTitle(stats.level);
  const rankColor = getRankColor(stats.level);

  const handleAllocate = async (
    stat: "strength" | "intelligence" | "vitality" | "agility" | "perception"
  ) => {
    if (!user) return;
    try {
      await allocateStatPoint(user.id, stat);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface-dark px-4 pt-4">
      {/* Level & Rank */}
      <View className="bg-surface rounded-2xl p-5 mb-4 border border-gray-800 items-center">
        <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">
          Hunter Rank
        </Text>
        <Text className="text-2xl font-bold mb-2" style={{ color: rankColor }}>
          {rankTitle}
        </Text>
        <Text className="text-xp text-3xl font-bold mb-1">
          {stats.total_xp} XP
        </Text>
        <XpBar
          currentXp={xpProgress.currentXp}
          xpNeeded={xpProgress.xpNeeded}
          level={xpProgress.level}
          percentage={xpProgress.percentage}
        />
      </View>

      {/* Stat Points */}
      {stats.stat_points > 0 && (
        <View className="bg-xp/10 rounded-xl p-3 mb-4 border border-xp/30">
          <Text className="text-xp text-center font-bold">
            {stats.stat_points} Stat Points Available — Tap + to allocate!
          </Text>
        </View>
      )}

      {/* Stats Grid */}
      <View className="bg-surface rounded-2xl p-5 mb-4 border border-gray-800">
        <Text className="text-white font-bold text-base mb-4 text-center">
          Hunter Attributes
        </Text>
        <View className="flex-row justify-center flex-wrap">
          {STAT_CONFIG.map((stat) => (
            <StatBadge
              key={stat.key}
              label={stat.label}
              value={stats[stat.key]}
              color={stat.color}
              canAllocate={stats.stat_points > 0}
              onAllocate={() => handleAllocate(stat.key)}
            />
          ))}
        </View>
      </View>

      {/* Stat Descriptions */}
      <View className="bg-surface rounded-2xl p-5 mb-8 border border-gray-800">
        <Text className="text-white font-bold text-base mb-3">
          Attribute Guide
        </Text>
        {STAT_CONFIG.map((stat) => (
          <View key={stat.key} className="flex-row items-center mb-2">
            <Text
              className="font-bold text-sm w-10"
              style={{ color: stat.color }}
            >
              {stat.label}
            </Text>
            <Text className="text-gray-400 text-sm">{stat.desc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
