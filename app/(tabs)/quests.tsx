import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useAuthStore } from "@/store/auth-store";
import { useQuestStore } from "@/store/quest-store";
import { useStatsStore } from "@/store/stats-store";
import { useStreakStore } from "@/store/streak-store";
import { QuestCard } from "@/components/ui/QuestCard";
import { QuestDifficulty } from "@/types";
import { QUEST_DIFFICULTY_COLORS, QUEST_XP_REWARDS } from "@/constants";

const DIFFICULTIES: QuestDifficulty[] = ["E", "D", "C", "B", "A", "S"];

export default function QuestsScreen() {
  const { user } = useAuthStore();
  const { quests, fetchQuests, createQuest, completeQuest, deleteQuest } =
    useQuestStore();
  const { addXp } = useStatsStore();
  const { recordActivity } = useStreakStore();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("E");
  const [filter, setFilter] = useState<"active" | "completed" | "all">(
    "active"
  );

  useEffect(() => {
    if (user) fetchQuests(user.id);
  }, [user]);

  const filteredQuests = quests.filter((q) => {
    if (filter === "active") return q.status === "active";
    if (filter === "completed") return q.status === "completed";
    return true;
  });

  const handleCreate = async () => {
    if (!user || !title.trim()) {
      Alert.alert("Error", "Quest title is required");
      return;
    }
    try {
      await createQuest(user.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        difficulty,
      });
      setTitle("");
      setDescription("");
      setDifficulty("E");
      setShowCreate(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleComplete = async (questId: string) => {
    if (!user) return;
    try {
      const xpEarned = await completeQuest(questId, user.id);
      if (xpEarned > 0) {
        await addXp(user.id, xpEarned);
        const streakBonus = await recordActivity(user.id);
        const totalXp = xpEarned + streakBonus;
        Alert.alert(
          "Quest Complete!",
          `+${xpEarned} XP earned!${
            streakBonus > 0 ? `\n+${streakBonus} XP streak bonus!` : ""
          }`
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDelete = async (questId: string) => {
    Alert.alert("Delete Quest", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteQuest(questId),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-surface-dark">
      {/* Filter Tabs */}
      <View className="flex-row px-4 pt-4 gap-2">
        {(["active", "completed", "all"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg ${
              filter === f ? "bg-primary" : "bg-surface-light"
            }`}
          >
            <Text
              className={`text-sm font-medium capitalize ${
                filter === f ? "text-white" : "text-gray-400"
              }`}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Quest List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {filteredQuests.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-gray-500 text-base">
              No {filter === "all" ? "" : filter} quests
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              Create a quest to begin your hunt
            </Text>
          </View>
        ) : (
          filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={() => handleComplete(quest.id)}
              onDelete={() => handleDelete(quest.id)}
            />
          ))
        )}
        <View className="h-24" />
      </ScrollView>

      {/* Create Button */}
      <Pressable
        onPress={() => setShowCreate(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
      >
        <Text className="text-white text-2xl font-bold">+</Text>
      </Pressable>

      {/* Create Quest Modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <View className="flex-1 justify-end">
          <View className="bg-surface rounded-t-3xl p-6 border-t border-gray-800">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-xl font-bold">New Quest</Text>
              <Pressable onPress={() => setShowCreate(false)}>
                <Text className="text-gray-400 text-base">Cancel</Text>
              </Pressable>
            </View>

            <Text className="text-gray-400 text-sm mb-2">TITLE</Text>
            <TextInput
              className="bg-surface-dark text-white rounded-xl px-4 py-3 mb-4 border border-gray-800"
              placeholder="Quest title..."
              placeholderTextColor="#666"
              value={title}
              onChangeText={setTitle}
            />

            <Text className="text-gray-400 text-sm mb-2">
              DESCRIPTION (optional)
            </Text>
            <TextInput
              className="bg-surface-dark text-white rounded-xl px-4 py-3 mb-4 border border-gray-800"
              placeholder="Quest details..."
              placeholderTextColor="#666"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text className="text-gray-400 text-sm mb-2">DIFFICULTY</Text>
            <View className="flex-row gap-2 mb-2">
              {DIFFICULTIES.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDifficulty(d)}
                  className={`flex-1 py-3 rounded-xl items-center border ${
                    difficulty === d ? "border-2" : "border-gray-800"
                  }`}
                  style={{
                    borderColor:
                      difficulty === d
                        ? QUEST_DIFFICULTY_COLORS[d]
                        : undefined,
                    backgroundColor:
                      difficulty === d
                        ? QUEST_DIFFICULTY_COLORS[d] + "20"
                        : "#25253E",
                  }}
                >
                  <Text
                    className="font-bold text-sm"
                    style={{
                      color:
                        difficulty === d
                          ? QUEST_DIFFICULTY_COLORS[d]
                          : "#888",
                    }}
                  >
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text className="text-xp text-sm mb-6 text-center">
              Reward: +{QUEST_XP_REWARDS[difficulty]} XP
            </Text>

            <Pressable
              onPress={handleCreate}
              className="bg-primary rounded-xl py-4 items-center"
            >
              <Text className="text-white font-bold text-base">
                CREATE QUEST
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
