import React from "react";
import { View, Text, Pressable } from "react-native";

type StatBadgeProps = {
  label: string;
  value: number;
  color?: string;
  onAllocate?: () => void;
  canAllocate?: boolean;
};

export function StatBadge({
  label,
  value,
  color = "#6C5CE7",
  onAllocate,
  canAllocate = false,
}: StatBadgeProps) {
  return (
    <View className="items-center mx-2">
      <View
        className="w-14 h-14 rounded-xl items-center justify-center border border-opacity-30"
        style={{ backgroundColor: color + "20", borderColor: color }}
      >
        <Text className="text-white font-bold text-lg">{value}</Text>
      </View>
      <Text className="text-gray-400 text-xs mt-1 font-medium">{label}</Text>
      {canAllocate && onAllocate && (
        <Pressable
          onPress={onAllocate}
          className="mt-1 bg-primary rounded-full w-5 h-5 items-center justify-center"
        >
          <Text className="text-white text-xs font-bold">+</Text>
        </Pressable>
      )}
    </View>
  );
}
