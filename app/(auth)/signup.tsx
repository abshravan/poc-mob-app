import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useAuthStore } from "@/store/auth-store";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, loading } = useAuthStore();

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    try {
      await signUp(email.trim(), password, username.trim());
      Alert.alert("Welcome, Hunter!", "Your journey begins now.");
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message || "An error occurred");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6"
        className="bg-surface-dark"
      >
        {/* Header */}
        <View className="items-center mb-12">
          <Text className="text-primary text-4xl font-bold mb-2">AWAKEN</Text>
          <Text className="text-gray-400 text-base">
            Begin your hunter journey
          </Text>
        </View>

        {/* Form */}
        <View className="mb-8">
          <Text className="text-gray-400 text-sm mb-2 font-medium">
            HUNTER NAME
          </Text>
          <TextInput
            className="bg-surface-light text-white rounded-xl px-4 py-3 mb-4 border border-gray-800"
            placeholder="Choose your name"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text className="text-gray-400 text-sm mb-2 font-medium">EMAIL</Text>
          <TextInput
            className="bg-surface-light text-white rounded-xl px-4 py-3 mb-4 border border-gray-800"
            placeholder="hunter@example.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text className="text-gray-400 text-sm mb-2 font-medium">
            PASSWORD
          </Text>
          <TextInput
            className="bg-surface-light text-white rounded-xl px-4 py-3 mb-6 border border-gray-800"
            placeholder="Min 6 characters"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            className="bg-primary rounded-xl py-4 items-center"
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            <Text className="text-white font-bold text-base">
              {loading ? "AWAKENING..." : "AWAKEN"}
            </Text>
          </Pressable>
        </View>

        {/* Login Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-400">Already a hunter? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-accent font-bold">Enter Dungeon</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
