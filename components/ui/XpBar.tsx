import React from "react";
import { View, Text } from "react-native";

type XpBarProps = {
  currentXp: number;
  xpNeeded: number;
  level: number;
  percentage: number;
};

export function XpBar({ currentXp, xpNeeded, level, percentage }: XpBarProps) {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-white font-bold text-sm">Level {level}</Text>
        <Text className="text-gray-400 text-xs">
          {currentXp} / {xpNeeded} XP
        </Text>
      </View>
      <View className="h-3 bg-surface-dark rounded-full overflow-hidden">
        <View
          className="h-full bg-accent rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </View>
    </View>
  );
}
