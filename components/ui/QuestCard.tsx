import React from "react";
import { View, Text, Pressable } from "react-native";
import { Quest } from "@/types";
import { QUEST_DIFFICULTY_COLORS } from "@/constants";

type QuestCardProps = {
  quest: Quest;
  onComplete?: () => void;
  onDelete?: () => void;
};

export function QuestCard({ quest, onComplete, onDelete }: QuestCardProps) {
  const diffColor = QUEST_DIFFICULTY_COLORS[quest.difficulty] || "#808080";
  const isCompleted = quest.status === "completed";

  return (
    <View
      className="bg-surface-light rounded-xl p-4 mb-3 border border-gray-800"
      style={{ opacity: isCompleted ? 0.6 : 1 }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <View
            className="w-8 h-8 rounded-lg items-center justify-center mr-3"
            style={{ backgroundColor: diffColor + "30" }}
          >
            <Text style={{ color: diffColor }} className="font-bold text-sm">
              {quest.difficulty}
            </Text>
          </View>
          <Text
            className="text-white font-semibold text-base flex-1"
            numberOfLines={1}
          >
            {quest.title}
          </Text>
        </View>
        <Text className="text-xp font-bold text-sm ml-2">
          +{quest.xp_reward} XP
        </Text>
      </View>

      {quest.description && (
        <Text className="text-gray-400 text-sm mb-3" numberOfLines={2}>
          {quest.description}
        </Text>
      )}

      {!isCompleted && (
        <View className="flex-row justify-end gap-2">
          {onDelete && (
            <Pressable
              onPress={onDelete}
              className="px-3 py-1.5 rounded-lg bg-danger/20"
            >
              <Text className="text-danger text-sm font-medium">Delete</Text>
            </Pressable>
          )}
          {onComplete && (
            <Pressable
              onPress={onComplete}
              className="px-4 py-1.5 rounded-lg bg-success/20"
            >
              <Text className="text-success text-sm font-bold">Complete</Text>
            </Pressable>
          )}
        </View>
      )}

      {isCompleted && (
        <Text className="text-success text-sm font-medium text-right">
          Completed
        </Text>
      )}
    </View>
  );
}
