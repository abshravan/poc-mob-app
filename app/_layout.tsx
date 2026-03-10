import "../global.css";
import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/store/auth-store";

export default function RootLayout() {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized) {
    return (
      <View className="flex-1 bg-surface-dark items-center justify-center">
        <ActivityIndicator size="large" color="#6C5CE7" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}
