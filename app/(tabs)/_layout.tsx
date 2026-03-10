import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0F0F23" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        tabBarStyle: {
          backgroundColor: "#1A1A2E",
          borderTopColor: "#25253E",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: "#6C5CE7",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerTitle: "SOLO LEVEL UP",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>⚔️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: "Quests",
          headerTitle: "QUEST LOG",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📜</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: "Focus",
          headerTitle: "FOCUS SESSION",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🎯</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          headerTitle: "HUNTER STATS",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📊</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "PROFILE",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
