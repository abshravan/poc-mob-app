import React from "react";
import { View, Text } from "react-native";

type TimerCircleProps = {
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  sessionType: string;
};

export function TimerCircle({
  timeRemaining,
  totalTime,
  sessionType,
}: TimerCircleProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  const isFocus = sessionType === "focus";
  const borderColor = isFocus ? "#6C5CE7" : "#00D2FF";

  return (
    <View className="items-center justify-center my-8">
      <View
        className="w-56 h-56 rounded-full items-center justify-center border-4"
        style={{
          borderColor,
          backgroundColor: borderColor + "10",
        }}
      >
        <Text className="text-white text-5xl font-bold">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </Text>
        <Text className="text-gray-400 text-sm mt-2 uppercase">
          {sessionType.replace("_", " ")}
        </Text>
      </View>
      <View className="w-56 h-1 bg-surface-dark rounded-full mt-4 overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: borderColor,
          }}
        />
      </View>
    </View>
  );
}
